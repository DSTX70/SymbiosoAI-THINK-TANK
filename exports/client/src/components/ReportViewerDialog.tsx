import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  Printer, 
  FileText, 
  Clock, 
  Calendar,
  User,
  BarChart3,
  BookOpen,
  ExternalLink,
  Copy,
  X,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GeneratedReport } from "@shared/schema";

interface ReportViewerDialogProps {
  report: GeneratedReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPORT_TYPE_INFO = {
  executive: {
    title: "Executive Summary",
    description: "High-level overview with key findings",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  detailed: {
    title: "Detailed Analysis",
    description: "Comprehensive report with analysis",
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  full: {
    title: "Complete Report",
    description: "Full report with all details",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  }
} as const;

const EXPORT_FORMATS = {
  local: {
    label: "Original Format",
    description: "Download in the report's current format",
    icon: FileText,
  },
  word: {
    label: "Word Document",
    description: "Download as Word (.docx) file",
    icon: FileText,
  },
  text: {
    label: "Plain Text",
    description: "Download as text (.txt) file",
    icon: FileText,
  },
  json: {
    label: "JSON Data",
    description: "Download as JSON (.json) file",
    icon: FileText,
  },
} as const;

export function ReportViewerDialog({ report, open, onOpenChange }: ReportViewerDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>("local");
  const { toast } = useToast();

  if (!report) return null;

  const typeInfo = REPORT_TYPE_INFO[report.reportType as keyof typeof REPORT_TYPE_INFO] || REPORT_TYPE_INFO.detailed;
  const IconComponent = typeInfo.icon;

  const handleWordDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Call the backend API to generate Word document
      const response = await apiRequest('POST', '/api/export', {
        filename: `${report.title.replace(/[^a-z0-9]/gi, '_')}.docx`,
        content: report.content,
        format: 'docx',
        title: report.title,
        metadata: {
          reportType: report.reportType,
          generatedAt: report.generatedAt,
          sessionId: (report.metadata as any)?.sessionId,
          ...(report.metadata && typeof report.metadata === 'object' ? report.metadata : {})
        }
      });

      // Get the binary data from response
      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.replace(/[^a-z0-9]/gi, '_')}.docx`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        description: "Word document downloaded successfully!",
      });
    } catch (error) {
      console.error('Word download failed:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download Word document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleLocalDownload = async (format: string) => {
    setIsDownloading(true);
    
    try {
      let content = report.content;
      let mimeType = "text/plain";
      let extension = ".txt";
      let formatLabel = "text";

      if (format === "json") {
        // Create JSON format
        const jsonData = {
          title: report.title,
          reportType: report.reportType,
          format: report.format,
          content: report.content,
          metadata: report.metadata,
          generatedAt: report.generatedAt
        };
        content = JSON.stringify(jsonData, null, 2);
        mimeType = "application/json";
        extension = ".json";
        formatLabel = "JSON";
      } else if (format === "text") {
        // Plain text format
        content = report.content;
        mimeType = "text/plain";
        extension = ".txt";
        formatLabel = "text";
      } else {
        // Original format
        if (report.format === "html") {
          mimeType = "text/html";
          extension = ".html";
          formatLabel = "HTML";
        } else if (report.format === "markdown") {
          mimeType = "text/markdown";
          extension = ".md";
          formatLabel = "Markdown";
        } else {
          mimeType = "text/plain";
          extension = ".txt";
          formatLabel = "text";
        }
      }

      const defaultFileName = `${report.title.replace(/[^a-z0-9]/gi, '_')}${extension}`;
      
      // Use File System Access API if available (Chrome, Edge, etc.)
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: defaultFileName,
            types: [{
              description: `${formatLabel.toUpperCase()} files`,
              accept: {
                [mimeType]: [extension],
              },
            }],
          });

          const writable = await fileHandle.createWritable();
          await writable.write(content);
          await writable.close();

          toast({
            description: "Report saved successfully to chosen location!",
          });
        } catch (saveError: any) {
          // User cancelled or error occurred, fall back to default download
          if (saveError.name !== 'AbortError') {
            throw saveError;
          }
        }
      } else {
        // Fallback to traditional download for browsers that don't support File System Access API
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = defaultFileName;
        link.click();
        URL.revokeObjectURL(url);

        toast({
          description: "Report downloaded successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the report.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    if (selectedFormat === "word") {
      await handleWordDownload();
    } else {
      await handleLocalDownload(selectedFormat);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let printContent = report.content;
      
      // If it's markdown, convert basic formatting for printing
      if (report.format === "markdown") {
        printContent = convertMarkdownToHTML(printContent);
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${report.title}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 { color: #2d3748; margin-top: 24px; margin-bottom: 16px; }
            h1 { font-size: 2em; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            h2 { font-size: 1.5em; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            p { margin-bottom: 16px; }
            ul, ol { margin-bottom: 16px; padding-left: 24px; }
            li { margin-bottom: 4px; }
            blockquote { 
              border-left: 4px solid #4299e1; 
              padding-left: 16px; 
              margin: 16px 0; 
              color: #718096; 
            }
            code { 
              background-color: #f7fafc; 
              padding: 2px 4px; 
              border-radius: 3px; 
              font-family: 'Monaco', 'Menlo', monospace;
            }
            pre { 
              background-color: #f7fafc; 
              padding: 16px; 
              border-radius: 6px; 
              overflow-x: auto;
              font-family: 'Monaco', 'Menlo', monospace;
            }
            .report-header {
              text-align: center;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .report-meta {
              font-size: 0.9em;
              color: #718096;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1>${report.title}</h1>
            <div class="report-meta">
              <p>Report Type: ${typeInfo.title}</p>
              <p>Generated: ${report.generatedAt ? new Date(report.generatedAt).toLocaleString() : 'Unknown'}</p>
              <p>Format: ${report.format.toUpperCase()}</p>
            </div>
          </div>
          ${report.format === "html" ? printContent : `<pre>${printContent}</pre>`}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(report.content);
      toast({
        description: "Report content copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy report content.",
        variant: "destructive",
      });
    }
  };

  const convertMarkdownToHTML = (markdown: string): string => {
    // Basic markdown to HTML conversion for printing
    return markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/^\s*/, '<p>')
      .replace(/\s*$/, '</p>')
      // Lists (basic)
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
  };

  const formatDate = (date: Date | null | string) => {
    if (!date) return 'Unknown';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentPreview = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const renderContent = () => {
    if (report.format === "html") {
      return (
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: report.content }}
          data-testid="report-html-content"
        />
      );
    } else {
      // For markdown and other formats, display as preformatted text
      return (
        <div className="font-mono text-sm whitespace-pre-wrap" data-testid="report-text-content">
          {report.content}
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold pr-8" data-testid="report-viewer-title">
                {report.title}
              </DialogTitle>
              <DialogDescription className="mt-2">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${typeInfo.color}`} />
                    <Badge 
                      variant="secondary" 
                      className={`${typeInfo.bgColor} ${typeInfo.color} font-medium`}
                      data-testid="report-type-badge"
                    >
                      {typeInfo.title}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground" data-testid="report-date">
                      {formatDate(report.generatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground" data-testid="report-format">
                      {report.format.toUpperCase()}
                    </span>
                  </div>
                </div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        {/* Action Buttons */}
        <div className="flex items-center gap-2 py-2">
          <div className="flex items-center gap-2">
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger className="w-48" data-testid="select-export-format">
                <SelectValue placeholder="Choose format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{EXPORT_FORMATS.local.label}</div>
                      <div className="text-xs text-muted-foreground">{EXPORT_FORMATS.local.description}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="word">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{EXPORT_FORMATS.word.label}</div>
                      <div className="text-xs text-muted-foreground">{EXPORT_FORMATS.word.description}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="text">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{EXPORT_FORMATS.text.label}</div>
                      <div className="text-xs text-muted-foreground">{EXPORT_FORMATS.text.description}</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{EXPORT_FORMATS.json.label}</div>
                      <div className="text-xs text-muted-foreground">{EXPORT_FORMATS.json.description}</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading}
              data-testid="button-download-report"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            data-testid="button-print-report"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyContent}
            data-testid="button-copy-report"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Text
          </Button>
          
          {/* Session Info */}
          {(report.metadata as any)?.sessionId && (
            <div className="flex items-center gap-2 ml-auto">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground" data-testid="report-session-info">
                Session: {((report.metadata as any)?.sessionId as string).substring(0, 8)}...
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Report Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4">
              {renderContent()}
            </div>
          </ScrollArea>
        </div>

        {/* Footer with metadata */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <div className="font-medium text-foreground mb-1">Report Details</div>
              <div className="space-y-1">
                <div>Type: {typeInfo.title}</div>
                <div>Format: {report.format.toUpperCase()}</div>
                <div>Size: {Math.round(report.content.length / 1024)} KB</div>
              </div>
            </div>
            <div>
              <div className="font-medium text-foreground mb-1">Generation Info</div>
              <div className="space-y-1">
                <div>Generated: {formatDate(report.generatedAt)}</div>
                {(report.metadata as any)?.analysisTime && (
                  <div>Analysis Time: {(report.metadata as any).analysisTime}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}