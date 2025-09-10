import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileDown,
  Eye,
  Settings,
  Sparkles,
  BarChart3,
  BookOpen,
  Users,
  Lightbulb,
  Target,
  Shield
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { ReportRequest, ReportResponse } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ReportGenerationSectionProps {
  sessionId?: string;
  sessionHasResults?: boolean;
  onReportGenerated?: (report: ReportResponse) => void;
}

const REPORT_TYPE_INFO = {
  executive: {
    title: "Executive Summary",
    description: "High-level overview with key findings and recommendations (2-3 pages)",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    estimatedTime: "1-2 min"
  },
  detailed: {
    title: "Detailed Analysis",
    description: "Comprehensive report with full analysis and supporting evidence (5-8 pages)",
    icon: BookOpen,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    estimatedTime: "2-3 min"
  },
  full: {
    title: "Complete Report",
    description: "Full report with transcripts, methodology, and technical details (10+ pages)",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    estimatedTime: "3-5 min"
  }
} as const;

const FORMAT_INFO = {
  markdown: {
    title: "Markdown",
    description: "Plain text with formatting",
    icon: FileText,
    extension: ".md"
  },
  html: {
    title: "HTML",
    description: "Web page format",
    icon: Eye,
    extension: ".html"
  },
  pdf: {
    title: "PDF",
    description: "Portable document format",
    icon: FileDown,
    extension: ".pdf"
  }
} as const;

export function ReportGenerationSection({ 
  sessionId, 
  sessionHasResults = false,
  onReportGenerated 
}: ReportGenerationSectionProps) {
  const [reportType, setReportType] = useState<"executive" | "detailed" | "full">("detailed");
  const [includeCitations, setIncludeCitations] = useState(true);
  const [includeExpertSummary, setIncludeExpertSummary] = useState(true);
  const [format, setFormat] = useState<"markdown" | "pdf" | "html">("markdown");
  const [generatedReport, setGeneratedReport] = useState<ReportResponse | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reportMutation = useMutation({
    mutationFn: async (): Promise<ReportResponse> => {
      if (!sessionId) throw new Error("No session available");
      
      const request: ReportRequest = {
        session_id: sessionId,
        report_type: reportType,
        include_citations: includeCitations,
        include_expert_summary: includeExpertSummary,
        format: format
      };
      
      const response = await apiRequest("POST", "/api/report", request);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate report");
      }
      
      return response.json();
    },
    onSuccess: (report: ReportResponse) => {
      setGeneratedReport(report);
      onReportGenerated?.(report);
      toast({
        title: "Report Generated Successfully!",
        description: `Your ${reportType} report is ready for download.`,
      });
      // Invalidate sessions to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Report Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateReport = () => {
    if (!sessionHasResults) {
      toast({
        title: "Cannot Generate Report",
        description: "Complete a debate session first to generate a report.",
        variant: "destructive",
      });
      return;
    }
    
    reportMutation.mutate();
  };

  const handleDownloadReport = () => {
    if (!generatedReport) return;
    
    let content = "";
    const formatInfo = FORMAT_INFO[format];
    
    if (format === "markdown") {
      content = convertReportToMarkdown(generatedReport);
    } else if (format === "html") {
      content = convertReportToHTML(generatedReport);
    } else if (format === "pdf") {
      // For PDF, we'll use the HTML version and let the browser handle PDF conversion
      content = convertReportToHTML(generatedReport);
    }
    
    const blob = new Blob([content], { 
      type: format === "pdf" ? "text/html" : format === "html" ? "text/html" : "text/markdown" 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}${formatInfo.extension}`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({ 
      description: `Report downloaded as ${formatInfo.title}!` 
    });
  };

  const convertReportToMarkdown = (report: ReportResponse): string => {
    let markdown = `# ${report.title}\n\n`;
    
    // Metadata
    markdown += `**Generated:** ${new Date(report.metadata.generated_at).toLocaleString()}\n`;
    markdown += `**Report Type:** ${report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)}\n`;
    if (report.metadata.total_analysis_time) {
      markdown += `**Analysis Time:** ${report.metadata.total_analysis_time}\n`;
    }
    markdown += `\n---\n\n`;
    
    // Executive Summary
    markdown += `## Executive Summary\n\n${report.executive_summary}\n\n`;
    
    // Debate Overview
    markdown += `## Debate Overview\n\n`;
    markdown += `**Original Question:** ${report.debate_overview.original_question}\n\n`;
    markdown += `**Methodology:** ${report.debate_overview.methodology}\n\n`;
    markdown += `**Participants:** ${report.debate_overview.participants.join(", ")}\n\n`;
    markdown += `**Rounds Conducted:** ${report.debate_overview.rounds_conducted}\n\n`;
    markdown += `**Consensus Reached:** ${report.debate_overview.consensus_reached}\n\n`;
    
    if (report.debate_overview.key_dissents.length > 0) {
      markdown += `### Key Dissenting Views\n\n`;
      report.debate_overview.key_dissents.forEach((dissent, index) => {
        markdown += `${index + 1}. **${dissent.position}**\n`;
        if (dissent.reasoning) {
          markdown += `   ${dissent.reasoning}\n`;
        }
        markdown += `\n`;
      });
    }
    
    if (report.debate_overview.unresolved_questions.length > 0) {
      markdown += `### Unresolved Questions\n\n`;
      report.debate_overview.unresolved_questions.forEach((question, index) => {
        markdown += `${index + 1}. ${question}\n`;
      });
      markdown += `\n`;
    }
    
    // Brainstorming Outcomes (if available)
    if (report.brainstorming_outcomes) {
      markdown += `## Brainstorming Outcomes\n\n`;
      
      if (report.brainstorming_outcomes.collaborative_solutions.length > 0) {
        markdown += `### Collaborative Solutions\n\n`;
        report.brainstorming_outcomes.collaborative_solutions.forEach((solution, index) => {
          markdown += `${index + 1}. **${solution.title}**\n`;
          markdown += `   ${solution.description}\n`;
          markdown += `   - **Feasibility:** ${solution.feasibility}\n`;
          markdown += `   - **Impact:** ${solution.impact}\n`;
          if (solution.timeline) markdown += `   - **Timeline:** ${solution.timeline}\n`;
          if (solution.resources_required?.length) {
            markdown += `   - **Resources:** ${solution.resources_required.join(", ")}\n`;
          }
          markdown += `\n`;
        });
      }
      
      if (report.brainstorming_outcomes.implementation_plan.length > 0) {
        markdown += `### Implementation Plan\n\n`;
        report.brainstorming_outcomes.implementation_plan.forEach((step) => {
          markdown += `${step.step}. **${step.title}**\n`;
          markdown += `   ${step.description}\n`;
          if (step.owner) markdown += `   - **Owner:** ${step.owner}\n`;
          if (step.timeline) markdown += `   - **Timeline:** ${step.timeline}\n`;
          if (step.dependencies?.length) {
            markdown += `   - **Dependencies:** ${step.dependencies.join(", ")}\n`;
          }
          markdown += `\n`;
        });
      }
    }
    
    // Expert Analysis (if available)
    if (report.expert_analysis) {
      markdown += `## Expert Analysis\n\n`;
      
      if (report.expert_analysis.domain_experts_consulted.length > 0) {
        markdown += `### Domain Experts Consulted\n\n`;
        report.expert_analysis.domain_experts_consulted.forEach((expert, index) => {
          markdown += `${index + 1}. **${expert.role}** (${expert.expert_type})\n`;
          markdown += `   - **Confidence Level:** ${expert.confidence_level}\n`;
          if (expert.key_contributions.length > 0) {
            markdown += `   - **Key Contributions:**\n`;
            expert.key_contributions.forEach(contribution => {
              markdown += `     - ${contribution}\n`;
            });
          }
          markdown += `\n`;
        });
      }
      
      if (report.expert_analysis.ai_agents_summary.length > 0) {
        markdown += `### AI Agents Summary\n\n`;
        report.expert_analysis.ai_agents_summary.forEach((agent, index) => {
          markdown += `${index + 1}. **${agent.agent_name}** - ${agent.role}\n`;
          markdown += `   - **Approach:** ${agent.approach}\n`;
          if (agent.key_insights.length > 0) {
            markdown += `   - **Key Insights:**\n`;
            agent.key_insights.forEach(insight => {
              markdown += `     - ${insight}\n`;
            });
          }
          markdown += `\n`;
        });
      }
    }
    
    // Recommendations
    if (report.recommendations.length > 0) {
      markdown += `## Recommendations\n\n`;
      report.recommendations.forEach((rec, index) => {
        markdown += `${index + 1}. **${rec.title}** (Priority: ${rec.priority})\n`;
        markdown += `   ${rec.description}\n`;
        if (rec.timeline) markdown += `   - **Timeline:** ${rec.timeline}\n`;
        if (rec.stakeholders?.length) {
          markdown += `   - **Stakeholders:** ${rec.stakeholders.join(", ")}\n`;
        }
        markdown += `\n`;
      });
    }
    
    // Citations (if available)
    if (report.citations?.length) {
      markdown += `## Citations\n\n`;
      report.citations.forEach((citation, index) => {
        markdown += `${index + 1}. `;
        if (citation.title) markdown += `**${citation.title}**. `;
        if (citation.author) markdown += `${citation.author}. `;
        if (citation.year) markdown += `(${citation.year}). `;
        if (citation.source) markdown += `${citation.source}. `;
        if (citation.url) markdown += `[Link](${citation.url})`;
        if (citation.relevance) markdown += ` - ${citation.relevance}`;
        markdown += `\n`;
      });
    }
    
    return markdown;
  };

  const convertReportToHTML = (report: ReportResponse): string => {
    // This is a simplified HTML conversion
    // In a production app, you might want to use a more sophisticated markdown-to-HTML converter
    const markdown = convertReportToMarkdown(report);
    
    let html = `
<!DOCTYPE html>
<html>
<head>
    <title>${report.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2, h3 { color: #2563eb; }
        h1 { border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        h2 { border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; margin: 16px 0; background: #f8fafc; }
        ul, ol { padding-left: 20px; }
        li { margin: 4px 0; }
        strong { color: #1e40af; }
        hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    </style>
</head>
<body>
${markdown
  .replace(/^# (.+)$/gm, '<h1>$1</h1>')
  .replace(/^## (.+)$/gm, '<h2>$1</h2>')
  .replace(/^### (.+)$/gm, '<h3>$1</h3>')
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/^---$/gm, '<hr>')
  .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
  .replace(/^- (.+)$/gm, '<li>$1</li>')
  .replace(/\n\n/g, '</p><p>')
  .replace(/^/, '<p>')
  .replace(/$/, '</p>')
}
</body>
</html>`;
    
    return html;
  };

  const previewReport = () => {
    if (generatedReport) {
      setShowPreview(true);
    }
  };

  if (!sessionHasResults) {
    return (
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="text-muted-foreground" size={20} />
            Report Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8" data-testid="no-results-state">
            <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-medium mb-2">No Results Available</h3>
            <p className="text-muted-foreground mb-4">
              Complete a debate session first to generate comprehensive reports.
            </p>
            <p className="text-sm text-muted-foreground">
              Start a debate session to unlock comprehensive report generation with AI-powered insights.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="section-report-generation">
      {/* Configuration Card */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <FileText className="text-secondary" size={20} />
            Report Generation
            {generatedReport && (
              <Badge className="ml-auto" variant="secondary">
                <CheckCircle size={12} className="mr-1" />
                Ready
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Report Type</Label>
            <RadioGroup 
              value={reportType} 
              onValueChange={(value: "executive" | "detailed" | "full") => setReportType(value)}
              className="space-y-3"
              data-testid="radiogroup-report-type"
            >
              {Object.entries(REPORT_TYPE_INFO).map(([type, info]) => {
                const IconComponent = info.icon;
                return (
                  <div key={type} className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={type} 
                      id={type} 
                      className="mt-1"
                      data-testid={`radio-report-type-${type}`}
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={type} 
                        className="cursor-pointer"
                        data-testid={`label-report-type-${type}`}
                      >
                        <div className={`p-4 rounded-lg border-2 transition-all ${
                          reportType === type 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}>
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent className={info.color} size={20} />
                            <span className="font-medium">{info.title}</span>
                            <Badge variant="outline" className="ml-auto">
                              <Clock size={12} className="mr-1" />
                              {info.estimatedTime}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Report Options</Label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label 
                    htmlFor="include-citations"
                    className="text-sm font-medium"
                    data-testid="label-include-citations"
                  >
                    Include Citations
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Add source references and supporting evidence
                  </p>
                </div>
                <Switch
                  id="include-citations"
                  checked={includeCitations}
                  onCheckedChange={setIncludeCitations}
                  data-testid="switch-citations"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label 
                    htmlFor="include-expert-summary"
                    className="text-sm font-medium"
                    data-testid="label-include-expert-summary"
                  >
                    Include Expert Summary
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Add analysis from domain experts and AI agents
                  </p>
                </div>
                <Switch
                  id="include-expert-summary"
                  checked={includeExpertSummary}
                  onCheckedChange={setIncludeExpertSummary}
                  data-testid="switch-expert-summary"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Format Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Output Format</Label>
            <RadioGroup 
              value={format} 
              onValueChange={(value: "markdown" | "pdf" | "html") => setFormat(value)}
              className="grid grid-cols-3 gap-4"
              data-testid="radiogroup-format"
            >
              {Object.entries(FORMAT_INFO).map(([formatType, info]) => {
                const IconComponent = info.icon;
                return (
                  <div key={formatType}>
                    <RadioGroupItem 
                      value={formatType} 
                      id={formatType} 
                      className="sr-only"
                      data-testid={`radio-format-${formatType}`}
                    />
                    <Label 
                      htmlFor={formatType} 
                      className="cursor-pointer"
                      data-testid={`label-format-${formatType}`}
                    >
                      <div className={`p-4 rounded-lg border-2 text-center transition-all ${
                        format === formatType 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}>
                        <IconComponent className="mx-auto mb-2 text-muted-foreground" size={24} />
                        <div className="font-medium text-sm">{info.title}</div>
                        <div className="text-xs text-muted-foreground">{info.description}</div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleGenerateReport}
              disabled={reportMutation.isPending || !sessionHasResults}
              className="flex-1"
              data-testid="button-generate-report"
            >
              {reportMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating Report...
                </>
              ) : !sessionHasResults ? (
                <>
                  <AlertCircle className="mr-2" size={16} />
                  Complete Debate First
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={16} />
                  Generate {REPORT_TYPE_INFO[reportType].title}
                </>
              )}
            </Button>
            
            {generatedReport && (
              <>
                <Button
                  variant="outline"
                  onClick={previewReport}
                  data-testid="button-preview-report"
                >
                  <Eye className="mr-2" size={16} />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadReport}
                  data-testid={`button-download-${format}`}
                >
                  <Download className="mr-2" size={16} />
                  Download
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Report Summary Card */}
      {generatedReport && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              Report Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <div className="font-medium capitalize" data-testid="text-generated-report-type">
                    {generatedReport.report_type}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Generated</Label>
                  <div className="font-medium" data-testid="text-generated-report-time">
                    {new Date(generatedReport.metadata.generated_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Analysis Time</Label>
                  <div className="font-medium" data-testid="text-generated-analysis-time">
                    {generatedReport.metadata.total_analysis_time}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Word Count</Label>
                  <div className="font-medium" data-testid="text-generated-word-count">
                    {generatedReport.metadata.word_count?.toLocaleString() || "N/A"}
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <div className="font-medium" data-testid="text-generated-report-title">
                  {generatedReport.title}
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Executive Summary (Preview)</Label>
                <div className="text-sm bg-muted/50 p-3 rounded-md" data-testid="text-generated-executive-summary">
                  {generatedReport.executive_summary.length > 200 
                    ? `${generatedReport.executive_summary.substring(0, 200)}...` 
                    : generatedReport.executive_summary
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle data-testid="dialog-title-report-preview">
              Report Preview: {generatedReport?.title}
            </DialogTitle>
            <DialogDescription>
              {FORMAT_INFO[format].title} format preview
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full pr-4">
            <div className="prose prose-sm max-w-none" data-testid="content-report-preview">
              {generatedReport && format === "markdown" && (
                <pre className="whitespace-pre-wrap text-sm">
                  {convertReportToMarkdown(generatedReport)}
                </pre>
              )}
              {generatedReport && format === "html" && (
                <div dangerouslySetInnerHTML={{ 
                  __html: convertReportToHTML(generatedReport) 
                }} />
              )}
              {generatedReport && format === "pdf" && (
                <div className="text-center py-8">
                  <FileDown className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <p className="text-muted-foreground">
                    PDF format preview not available. Download to view the PDF.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}