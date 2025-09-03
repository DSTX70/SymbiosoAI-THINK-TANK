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
  HelpCircle,
  Play,
  Link,
  Target,
  TrendingUp
} from "lucide-react";
import type { ThinkResponse, Citation, FactCheckFinding, FollowUpQuestion, FocusAreas } from "@shared/schema";

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
      case 'verified':
      case 'supported':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'disputed':
      case 'contradicted':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'partially_verified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'VERIFIED';
      case 'disputed': return 'DISPUTED';
      case 'partially_verified': return 'PARTIALLY VERIFIED';
      case 'supported': return 'SUPPORTED';
      case 'contradicted': return 'CONTRADICTED';
      default: return 'INCONCLUSIVE';
    }
  };

  const handleFactCheckClick = (finding: FactCheckFinding) => {
    // Interactive fact-check expansion
    console.log('Expanding fact-check details for:', finding.claim);
  };

  const handleFollowUpQuestion = (question: string) => {
    // Start a new debate with this question
    console.log('Starting debate with follow-up question:', question);
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
          <TabsList className="grid w-full grid-cols-6">
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
            <TabsTrigger value="factcheck" data-testid="tab-factcheck">
              Fact Check
            </TabsTrigger>
            <TabsTrigger value="explore" data-testid="tab-explore">
              Explore
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

          <TabsContent value="factcheck" className="mt-4">
            <ScrollArea className="h-96">
              {results.fact_check && results.fact_check.findings && results.fact_check.findings.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Clickable Fact-Check Ratings
                    </h4>
                    {results.fact_check.verification_settings && (
                      <div className="text-xs text-muted-foreground">
                        {results.fact_check.verification_settings.depth === 'comprehensive' ? 'Comprehensive' : 'Standard'} Verification
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click on any fact-check rating to dive deep into verification sources, methodology, and confidence levels.
                  </p>
                  
                  <div className="space-y-3">
                    {results.fact_check.findings.map((finding, index) => (
                      <div 
                        key={index} 
                        className="cursor-pointer p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                        onClick={() => handleFactCheckClick(finding)}
                        data-testid={`interactive-fact-check-${index}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-sm text-foreground font-medium mb-2">
                              "{finding.claim}"
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant="outline" 
                                className={`${getStatusColor(finding.status)} font-medium`}
                              >
                                {getStatusLabel(finding.status)}
                              </Badge>
                              {finding.confidence && (
                                <span className="text-sm font-medium text-foreground">
                                  {finding.confidence}% Confidence
                                </span>
                              )}
                              {finding.sources_count && (
                                <span className="text-xs text-muted-foreground">
                                  {finding.sources_count} sources
                                </span>
                              )}
                            </div>
                          </div>
                          {getStatusIcon(finding.status)}
                        </div>
                        {finding.note && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {finding.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Verification Settings Display */}
                  {results.fact_check.verification_settings && (
                    <div className="mt-4 p-3 bg-muted/20 rounded-lg">
                      <h5 className="text-xs font-medium mb-2">Verification Configuration</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Verification Depth:</span>
                          <span className="ml-1 capitalize">{results.fact_check.verification_settings.depth || 'Standard'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Minimum Sources:</span>
                          <span className="ml-1">{results.fact_check.verification_settings.min_sources || 3}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No fact-check data available</p>
                  <p className="text-xs text-muted-foreground mt-2">Enable fact-checking in Expert mode for interactive verification</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="explore" className="mt-4">
            <ScrollArea className="h-96">
              <div className="space-y-6">
                {/* Interactive Follow-up Questions */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-500" />
                    Clickable Unresolved Questions
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Transform debate results into new exploration opportunities. Click any unresolved question to automatically start a focused debate.
                  </p>
                  
                  {/* Auto-generated follow-up questions */}
                  {results.follow_up_questions && results.follow_up_questions.length > 0 ? (
                    <div className="space-y-2">
                      {results.follow_up_questions.map((followUp, index) => (
                        <div 
                          key={index}
                          className="cursor-pointer p-3 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group"
                          onClick={() => handleFollowUpQuestion(followUp.question)}
                          data-testid={`followup-question-${index}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                {followUp.question}
                              </p>
                              {followUp.category && (
                                <span className="text-xs text-muted-foreground">
                                  From: {followUp.category}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {followUp.complexity && (
                                <Badge variant="outline" className="text-xs">
                                  {followUp.complexity === 'high' ? 'High' : followUp.complexity === 'medium' ? 'Medium' : 'Low'} Complexity
                                </Badge>
                              )}
                              <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={12} className="mr-1" />
                                Start Debate
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // Show existing unresolved questions as clickable
                    <div className="space-y-2">
                      {results.unresolved?.map((question, index) => (
                        <div 
                          key={index}
                          className="cursor-pointer p-3 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group"
                          onClick={() => handleFollowUpQuestion(question)}
                          data-testid={`clickable-unresolved-${index}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                {question}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play size={12} className="mr-1" />
                              Start Debate
                            </Button>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8">
                          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No follow-up questions generated</p>
                          <p className="text-xs text-muted-foreground mt-2">Advanced analysis will generate relevant follow-up topics</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Focus Areas Analysis */}
                {results.focus_areas && (results.focus_areas.identified || results.focus_areas.connections) && (
                  <div className="space-y-3">
                    <Separator />
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Target className="h-4 w-4 text-orange-500" />
                      Focus Areas Analysis
                    </h4>

                    {results.focus_areas.identified && results.focus_areas.identified.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-muted-foreground">Identified Focus Areas</h5>
                        <div className="flex flex-wrap gap-2">
                          {results.focus_areas.identified.map((area, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {results.focus_areas.connections && results.focus_areas.connections.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Link className="h-3 w-3" />
                          Interdisciplinary Connections
                        </h5>
                        <p className="text-xs text-muted-foreground">Strong interdisciplinary connections found</p>
                        <div className="space-y-2">
                          {results.focus_areas.connections.map((connection, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted/20 rounded text-xs">
                              <span className="font-medium">{connection.from}</span>
                              <TrendingUp className={`h-3 w-3 ${
                                connection.strength === 'strong' ? 'text-green-500' :
                                connection.strength === 'moderate' ? 'text-yellow-500' : 'text-gray-500'
                              }`} />
                              <span className="font-medium">{connection.to}</span>
                              {connection.strength && (
                                <Badge variant="outline" className="text-xs ml-auto">
                                  {connection.strength}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Visual Story Maps */}
                <div className="space-y-3 mt-6">
                  <Separator />
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    Visual Story Maps
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Track your analytical journey, identify knowledge gaps, and visualize the evolution of debates and insights.
                  </p>
                  
                  <div className="space-y-4">
                    {/* Journey Progress */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg">
                      <h5 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        Journey Insights
                      </h5>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                          <div className="text-lg font-bold text-blue-600">78%</div>
                          <div className="text-xs text-muted-foreground">Complete</div>
                          <div className="text-xs text-muted-foreground">Strong technical coverage, weak social aspects</div>
                        </div>
                        <div className="text-center p-2 bg-white/50 dark:bg-gray-800/50 rounded">
                          <div className="text-lg font-bold text-green-600">12</div>
                          <div className="text-xs text-muted-foreground">Links</div>
                          <div className="text-xs text-muted-foreground">Strong interdisciplinary connections found</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-white/30 dark:bg-gray-800/30 rounded text-xs">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">1</span>
                          <span>Initial Question</span>
                          <span className="text-muted-foreground ml-auto">5 minutes ago • 3 models participated</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white/30 dark:bg-gray-800/30 rounded text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">2</span>
                          <span>Deep Analysis</span>
                          <span className="text-muted-foreground ml-auto">3 minutes ago • High complexity analysis</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-medium">3</span>
                          <span>Current Focus</span>
                          <span className="text-muted-foreground ml-auto">Now • In progress</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white/20 dark:bg-gray-800/20 rounded text-xs opacity-50">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="font-medium">?</span>
                          <span>Knowledge Gap</span>
                          <span className="text-muted-foreground ml-auto">Identified gap • Click to explore</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="text-xs">
                          <FileText size={12} className="mr-1" />
                          Reset Journey
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download size={12} className="mr-1" />
                          Export Map
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Target size={12} className="mr-1" />
                          Find Gaps
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}