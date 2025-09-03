import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  Download, 
  ExternalLink,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react";
import type { ThinkResponse, Citation, FactCheckFinding } from "@shared/schema";

interface ResultsAreaProps {
  results: ThinkResponse | null;
  isProcessing?: boolean;
  onExport?: (format: string) => void;
}

export function ResultsArea({ results, isProcessing, onExport }: ResultsAreaProps) {
  const [activeTab, setActiveTab] = useState("consensus");

  if (isProcessing) {
    return (
      <Card className="card-elevated h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">AI think tank processing your request...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="card-elevated h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Enter a prompt to start collaborative analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'supported':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'contradicted':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'supported':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'contradicted':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    }
  };

  return (
    <Card className="card-elevated h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="text-primary" size={20} />
            Analysis Results
          </CardTitle>
          {onExport && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onExport('pdf')}
                data-testid="button-export-pdf"
              >
                <Download size={14} className="mr-1" />
                PDF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onExport('json')}
                data-testid="button-export-json"
              >
                <Download size={14} className="mr-1" />
                JSON
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="consensus" data-testid="tab-consensus">
              Consensus
            </TabsTrigger>
            <TabsTrigger value="dissents" data-testid="tab-dissents">
              Dissents ({results.dissents?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="unresolved" data-testid="tab-unresolved">
              Unresolved ({results.unresolved?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="sources" data-testid="tab-sources">
              Sources ({results.citations?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consensus" className="mt-4">
            <ScrollArea className="h-96">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-foreground leading-relaxed" data-testid="text-consensus">
                  {results.consensus}
                </p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="dissents" className="mt-4">
            <ScrollArea className="h-96">
              {results.dissents && results.dissents.length > 0 ? (
                <div className="space-y-4">
                  {results.dissents.map((dissent, index) => (
                    <Card key={index} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-foreground" data-testid={`dissent-${index}`}>
                              {typeof dissent === 'string' ? dissent : dissent.position}
                            </p>
                            {typeof dissent === 'object' && dissent.reasoning && (
                              <p className="text-xs text-muted-foreground mt-2" data-testid={`dissent-reasoning-${index}`}>
                                {dissent.reasoning}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No dissenting opinions identified</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unresolved" className="mt-4">
            <ScrollArea className="h-96">
              {results.unresolved && results.unresolved.length > 0 ? (
                <div className="space-y-3">
                  {results.unresolved.map((question, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <HelpCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground" data-testid={`unresolved-${index}`}>
                        {question}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">All questions were resolved</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sources" className="mt-4">
            <ScrollArea className="h-96">
              {results.citations && results.citations.length > 0 ? (
                <div className="space-y-3">
                  {results.citations.map((citation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <ExternalLink className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground" data-testid={`citation-title-${index}`}>
                          {citation.title || citation.source || `Citation ${index + 1}`}
                        </p>
                        {citation.author && (
                          <p className="text-xs text-muted-foreground">
                            by {citation.author}
                          </p>
                        )}
                        {citation.url && (
                          <a 
                            href={citation.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                            data-testid={`citation-link-${index}`}
                          >
                            {citation.url}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No citations available</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Fact Check Results */}
        {results.fact_check && results.fact_check.findings && results.fact_check.findings.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Fact Check Results
              </h4>
              <div className="space-y-2">
                {results.fact_check.findings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                    {getStatusIcon(finding.status)}
                    <div className="flex-1">
                      <p className="text-xs text-foreground" data-testid={`fact-check-claim-${index}`}>
                        {finding.claim}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(finding.status)}`}
                          data-testid={`fact-check-status-${index}`}
                        >
                          {finding.status}
                        </Badge>
                        {finding.note && (
                          <span className="text-xs text-muted-foreground" data-testid={`fact-check-note-${index}`}>
                            {finding.note}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}