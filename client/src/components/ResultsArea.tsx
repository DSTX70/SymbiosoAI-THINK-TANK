import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
              <div className="space-y-4">
                {/* Question Generation Controls */}
                <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">How can sustainable energy adoption be accelerated in developing countries?</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-muted-foreground">From: Climate Strategy Analysis</span>
                      <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                        High Complexity
                      </Badge>
                    </div>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      Start Debate
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      Generate New Questions
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs text-blue-600 dark:text-blue-400">
                      Clear All
                    </Button>
                  </div>
                </div>

                {/* Fact-Check Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <h4 className="text-sm font-medium">Clickable Fact-Check Ratings</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Click on any fact-check rating to dive deep into verification sources, methodology, and confidence levels.
                  </p>

                  {/* Verification Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Verification Depth</Label>
                      <Select defaultValue="standard" data-testid="select-verification-depth">
                        <SelectTrigger>
                          <SelectValue placeholder="Standard Verification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Verification</SelectItem>
                          <SelectItem value="comprehensive">Comprehensive Verification</SelectItem>
                          <SelectItem value="expert_review">Expert Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Minimum Sources</Label>
                      <Select defaultValue="3" data-testid="select-minimum-sources">
                        <SelectTrigger>
                          <SelectValue placeholder="3 sources" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 source</SelectItem>
                          <SelectItem value="2">2 sources</SelectItem>
                          <SelectItem value="3">3 sources</SelectItem>
                          <SelectItem value="5">5 sources</SelectItem>
                          <SelectItem value="10">10 sources</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Sample Fact-Check Ratings */}
                <div className="space-y-3">
                  <h5 className="text-sm font-medium">Sample Fact-Check Ratings</h5>
                  
                  {/* Sample 1 - Verified */}
                  <div className="cursor-pointer p-4 border rounded-lg hover:bg-muted/30 transition-colors bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium mb-2">
                          "Renewable energy costs have decreased by 80% over the past decade"
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 font-medium">
                            ✓ VERIFIED
                          </Badge>
                          <span className="text-sm font-medium text-foreground">92% Confidence</span>
                        </div>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>

                  {/* Sample 2 - Disputed */}
                  <div className="cursor-pointer p-4 border rounded-lg hover:bg-muted/30 transition-colors bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium mb-2">
                          "Quantum computers will break all current encryption within 5 years"
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 font-medium">
                            ⚠ DISPUTED
                          </Badge>
                          <span className="text-sm font-medium text-foreground">34% Confidence</span>
                        </div>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>

                  {/* Sample 3 - Partially Verified */}
                  <div className="cursor-pointer p-4 border rounded-lg hover:bg-muted/30 transition-colors bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-foreground font-medium mb-2">
                          "Remote work increases productivity by 15-25% on average"
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 font-medium">
                            🔍 PARTIALLY VERIFIED
                          </Badge>
                          <span className="text-sm font-medium text-foreground">76% Confidence</span>
                        </div>
                      </div>
                      <HelpCircle className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Dynamic Results */}
                {results.fact_check && results.fact_check.findings && results.fact_check.findings.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h5 className="text-sm font-medium">Current Analysis Results</h5>
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
                  </div>
                )}
              </div>
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

                {/* Enhanced Visual Story Maps */}
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
                    {/* Coverage Analysis */}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border-l-4 border-l-blue-500">
                      <h5 className="text-sm font-medium mb-2">COVERAGE ANALYSIS</h5>
                      <div className="text-2xl font-bold text-blue-600 mb-1">78% Complete</div>
                      <p className="text-xs text-muted-foreground">Strong technical coverage, weak social aspects</p>
                    </div>

                    {/* Focus Areas */}
                    <div className="p-4 bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20 rounded-lg border-l-4 border-l-teal-500">
                      <h5 className="text-sm font-medium mb-2">FOCUS AREAS</h5>
                      <div className="text-2xl font-bold text-teal-600 mb-1">5 Identified</div>
                      <p className="text-xs text-muted-foreground">Technology, Economics, Policy, Social, Environmental</p>
                    </div>

                    {/* Connections */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border-l-4 border-l-purple-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Link className="h-4 w-4 text-purple-500" />
                        <h5 className="text-sm font-medium">CONNECTIONS</h5>
                      </div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">12 Links</div>
                      <p className="text-xs text-muted-foreground">Strong interdisciplinary connections found</p>
                    </div>

                    {/* Journey Timeline */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium">Journey Timeline</h5>
                      
                      {/* Step 1 - Completed */}
                      <div className="relative">
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-blue-200 dark:bg-blue-800"></div>
                        <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            1
                          </div>
                          <div className="flex-1">
                            <h6 className="font-medium text-sm">Initial Question</h6>
                            <p className="text-xs text-muted-foreground">Started debate on renewable energy adoption</p>
                            <div className="text-xs text-muted-foreground mt-1">5 MINUTES AGO • 3 MODELS PARTICIPATED</div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 - Completed */}
                      <div className="relative">
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-green-200 dark:bg-green-800"></div>
                        <div className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            2
                          </div>
                          <div className="flex-1">
                            <h6 className="font-medium text-sm">Deep Analysis</h6>
                            <p className="text-xs text-muted-foreground">Explored economic implications and policy challenges</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-muted-foreground">3 MINUTES AGO</div>
                              <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                HIGH COMPLEXITY ANALYSIS
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 - In Progress */}
                      <div className="relative">
                        <div className="absolute left-4 top-8 w-0.5 h-16 bg-green-200 dark:bg-green-800"></div>
                        <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 animate-pulse">
                            3
                          </div>
                          <div className="flex-1">
                            <h6 className="font-medium text-sm">Current Focus</h6>
                            <p className="text-xs text-muted-foreground">Investigating technology adoption barriers</p>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">NOW • IN PROGRESS</div>
                          </div>
                        </div>
                      </div>

                      {/* Knowledge Gap */}
                      <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          ?
                        </div>
                        <div className="flex-1">
                          <h6 className="font-medium text-sm">Knowledge Gap</h6>
                          <p className="text-xs text-muted-foreground">Missing analysis on social acceptance factors</p>
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">IDENTIFIED GAP • CLICK TO EXPLORE</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="text-xs">
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
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}