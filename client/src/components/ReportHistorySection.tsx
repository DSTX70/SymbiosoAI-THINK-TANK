import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Calendar, 
  Clock,
  Filter,
  Eye,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GeneratedReport } from "@shared/schema";

interface ReportHistorySectionProps {
  onViewReport?: (report: GeneratedReport) => void;
}

const REPORT_TYPE_INFO = {
  executive: {
    title: "Executive Summary",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    icon: FileText
  },
  detailed: {
    title: "Detailed Analysis", 
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    icon: FileText
  },
  full: {
    title: "Complete Report",
    color: "text-purple-600", 
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    icon: FileText
  }
} as const;

export function ReportHistorySection({ onViewReport }: ReportHistorySectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 6;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's reports
  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ["/api/reports"],
    queryFn: async (): Promise<GeneratedReport[]> => {
      const response = await apiRequest("GET", "/api/reports");
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      return response.json();
    },
  });

  // Delete report mutation
  const deleteMutation = useMutation({
    mutationFn: async (reportId: string): Promise<void> => {
      const response = await apiRequest("DELETE", `/api/reports/${reportId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete report");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Report Deleted",
        description: "The report has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchQuery || 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.metadata as any)?.sessionPrompt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || report.reportType === filterType;
    
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + reportsPerPage);

  const handleDeleteReport = (reportId: string) => {
    deleteMutation.mutate(reportId);
  };

  const handleDownloadReport = async (report: GeneratedReport) => {
    try {
      let content = report.content;
      let mimeType = "text/plain";
      let extension = ".txt";

      if (report.format === "html") {
        mimeType = "text/html";
        extension = ".html";
      } else if (report.format === "markdown") {
        mimeType = "text/markdown";
        extension = ".md";
      } else {
        // JSON format
        mimeType = "application/json";
        extension = ".json";
      }

      const defaultFileName = `${report.title.replace(/[^a-z0-9]/gi, '_')}${extension}`;

      // Use File System Access API if available (Chrome, Edge, etc.)
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: defaultFileName,
            types: [{
              description: `${report.format.toUpperCase()} files`,
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
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card className="card-elevated h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading reports...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card-elevated h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-destructive">Failed to load reports</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-elevated h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Report History
          {reports.length > 0 && (
            <Badge variant="secondary" data-testid="text-report-count">
              {reports.length}
            </Badge>
          )}
        </CardTitle>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-reports"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]" data-testid="select-filter-type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
                <SelectItem value="full">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredReports.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {reports.length === 0 ? "No Reports Yet" : "No Matching Reports"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {reports.length === 0 
                ? "Generate your first report to see it here."
                : "Try adjusting your search or filter criteria."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <ScrollArea className="h-[400px]">
              <div className="grid gap-4">
                {paginatedReports.map((report) => {
                  const typeInfo = REPORT_TYPE_INFO[report.reportType as keyof typeof REPORT_TYPE_INFO];
                  const Icon = typeInfo?.icon || FileText;

                  return (
                    <Card key={report.id} className="hover:bg-accent/50 transition-colors" data-testid={`card-report-${report.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${typeInfo?.color || 'text-gray-600'}`} />
                              <Badge 
                                variant="secondary" 
                                className={typeInfo?.bgColor || 'bg-gray-50'}
                                data-testid={`badge-type-${report.reportType}`}
                              >
                                {typeInfo?.title || report.reportType}
                              </Badge>
                              <Badge variant="outline" data-testid={`badge-format-${report.format}`}>
                                {report.format.toUpperCase()}
                              </Badge>
                            </div>

                            <h4 
                              className="font-medium line-clamp-2 cursor-pointer hover:text-primary"
                              onClick={() => onViewReport?.(report)}
                              data-testid={`text-report-title`}
                            >
                              {report.title}
                            </h4>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span data-testid="text-generated-date">
                                  {report.generatedAt ? formatDate(typeof report.generatedAt === 'string' ? report.generatedAt : report.generatedAt.toString()) : 'Unknown'}
                                </span>
                              </div>
                              {(report.metadata as any)?.wordCount && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span data-testid="text-word-count">
                                    {(report.metadata as any).wordCount} words
                                  </span>
                                </div>
                              )}
                            </div>

                            {(report.metadata as any)?.sessionPrompt && (
                              <p className="text-xs text-muted-foreground line-clamp-1" data-testid="text-session-prompt">
                                Session: {(report.metadata as any).sessionPrompt}
                              </p>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" data-testid="button-report-actions">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onViewReport?.(report)} data-testid="action-view-report">
                                <Eye className="h-4 w-4 mr-2" />
                                View Report
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadReport(report)} data-testid="action-download-report">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <Separator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                    data-testid="action-delete-report"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Report</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{report.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteReport(report.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      data-testid="button-confirm-delete"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + reportsPerPage, filteredReports.length)} of {filteredReports.length} reports
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    data-testid="button-prev-page"
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium" data-testid="text-page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}