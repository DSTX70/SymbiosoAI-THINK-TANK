import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Lightbulb, 
  CheckCircle, 
  Target, 
  Clock, 
  Users, 
  TrendingUp,
  ArrowRight,
  Zap,
  Wrench,
  Save,
  Download,
  MessageSquare,
  ExternalLink,
  FileText
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { BrainstormResponse } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BrainstormSectionProps {
  sessionId?: string;
  brainstormResults?: BrainstormResponse;
  onBrainstormStart?: () => void;
  onBrainstormComplete?: (results: BrainstormResponse) => void;
}

export function BrainstormSection({ 
  sessionId, 
  brainstormResults, 
  onBrainstormStart,
  onBrainstormComplete 
}: BrainstormSectionProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{type: 'solution' | 'action' | 'question', item: any, index: number} | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const brainstormMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error("No session available");
      
      const response = await apiRequest("POST", "/api/brainstorm", { sessionId, settings: {} });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to start brainstorming");
      }
      
      return response.json();
    },
    onMutate: () => {
      setIsStarting(true);
      onBrainstormStart?.();
    },
    onSuccess: (results: BrainstormResponse) => {
      setIsStarting(false);
      onBrainstormComplete?.(results);
      toast({
        title: "Brainstorming Complete!",
        description: `Generated ${results.solutions?.length || 0} solutions and ${results.action_plan?.length || 0} action steps.`,
      });
      // Invalidate sessions to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
    onError: (error: Error) => {
      setIsStarting(false);
      toast({
        title: "Brainstorming Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Follow-up question mutation for deeper dives
  const followUpMutation = useMutation({
    mutationFn: async (question: string) => {
      if (!sessionId || !selectedItem) throw new Error("No item selected");
      
      const response = await apiRequest("POST", "/api/brainstorm/followup", {
        sessionId,
        itemType: selectedItem.type,
        itemIndex: selectedItem.index,
        question,
        context: selectedItem.item
      });
      
      return response.json();
    },
    onMutate: () => {
      setIsAsking(true);
    },
    onSuccess: (data: any) => {
      setIsAsking(false);
      setFollowUpAnswer(data.answer);
      toast({
        title: "Follow-up Complete!",
        description: "Got detailed insights for your question.",
      });
    },
    onError: (error: Error) => {
      setIsAsking(false);
      setFollowUpAnswer("Unable to get follow-up insights at this time. Please try again.");
      toast({
        title: "Follow-up Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Save brainstorming results as JSON
  const handleSave = () => {
    if (!brainstormResults) return;
    
    const dataStr = JSON.stringify(brainstormResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brainstorming-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({ description: "Brainstorming results saved successfully!" });
  };

  // Export to markdown format
  const handleExportMarkdown = () => {
    if (!brainstormResults) return;
    
    let markdown = "# Brainstorming Results\n\n";
    
    if (brainstormResults.final_consensus) {
      markdown += `## Final Consensus\n\n${brainstormResults.final_consensus}\n\n`;
    }
    
    if (brainstormResults.solutions?.length > 0) {
      markdown += "## Solutions\n\n";
      brainstormResults.solutions.forEach((solution, index) => {
        markdown += `### ${index + 1}. ${solution.title}\n\n`;
        markdown += `**Description:** ${solution.description}\n\n`;
        markdown += `**Feasibility:** ${solution.feasibility} | **Impact:** ${solution.impact}\n\n`;
        if (solution.timeline) markdown += `**Timeline:** ${solution.timeline}\n\n`;
        if (solution.resources_required?.length) {
          markdown += `**Resources Required:** ${solution.resources_required.join(", ")}\n\n`;
        }
      });
    }
    
    if (brainstormResults.action_plan?.length > 0) {
      markdown += "## Action Plan\n\n";
      brainstormResults.action_plan.forEach((step) => {
        markdown += `${step.step}. **${step.title}**\n\n`;
        markdown += `   ${step.description}\n\n`;
        if (step.owner) markdown += `   *Owner:* ${step.owner}\n\n`;
        if (step.timeline) markdown += `   *Timeline:* ${step.timeline}\n\n`;
      });
    }
    
    const dataBlob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brainstorming-results-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({ description: "Brainstorming results exported as Markdown!" });
  };

  // Handle clicking on items for deeper exploration
  const handleItemClick = (type: 'solution' | 'action' | 'question', item: any, index: number) => {
    setSelectedItem({ type, item, index });
    setFollowUpQuestion("");
    setFollowUpAnswer("");
  };

  // Ask follow-up questions
  const handleAskFollowUp = () => {
    if (!followUpQuestion.trim()) return;
    followUpMutation.mutate(followUpQuestion);
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (!brainstormResults && !sessionId) {
    return (
      <Card className="card-elevated h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Complete a debate to unlock brainstorming</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!brainstormResults) {
    return (
      <Card className="card-elevated h-full">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Ready to Brainstorm!</h3>
              <p className="text-muted-foreground max-w-md">
                Transform your debate insights into collaborative solutions and actionable plans
              </p>
            </div>
            <Button 
              onClick={() => brainstormMutation.mutate()}
              disabled={isStarting}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              data-testid="button-start-brainstorm"
            >
              {isStarting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Starting Brainstorming...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Start Brainstorming Session
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="brainstorm-results">
      {/* Save and Export Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Brainstorming Results</h3>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="outline" size="sm" className="gap-2">
            <Save className="h-4 w-4" />
            Save JSON
          </Button>
          <Button onClick={handleExportMarkdown} variant="outline" size="sm" className="gap-2">
            <FileText className="h-4 w-4" />
            Export MD
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-96">
        <div className="space-y-6">
        {/* Final Consensus */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-blue-500" />
              Final Consensus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed" data-testid="brainstorm-consensus">
              {brainstormResults.final_consensus}
            </p>
          </CardContent>
        </Card>

        {/* Solutions */}
        {brainstormResults.solutions && brainstormResults.solutions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Collaborative Solutions ({brainstormResults.solutions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brainstormResults.solutions.map((solution, index) => (
                  <Card 
                    key={index} 
                    className="border-l-4 border-l-yellow-400 cursor-pointer hover:shadow-md transition-shadow" 
                    data-testid={`solution-${index}`}
                    onClick={() => handleItemClick('solution', solution, index)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-medium text-foreground">{solution.title}</h4>
                          <div className="flex gap-2 flex-shrink-0">
                            <Badge className={getFeasibilityColor(solution.feasibility)}>
                              {solution.feasibility} feasibility
                            </Badge>
                            <Badge className={getImpactColor(solution.impact)}>
                              {solution.impact} impact
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{solution.description}</p>
                        {(solution.timeline || solution.resources_required) && (
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            {solution.timeline && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {solution.timeline}
                              </div>
                            )}
                            {solution.resources_required && solution.resources_required.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Wrench className="h-3 w-3" />
                                {solution.resources_required.join(", ")}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Plan */}
        {brainstormResults.action_plan && brainstormResults.action_plan.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Implementation Action Plan ({brainstormResults.action_plan.length} steps)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {brainstormResults.action_plan.map((step, index) => (
                  <Card 
                    key={index} 
                    className="border-l-4 border-l-green-400 cursor-pointer hover:shadow-md transition-shadow" 
                    data-testid={`action-step-${index}`}
                    onClick={() => handleItemClick('action', step, index)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{step.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                            {(step.owner || step.timeline || step.dependencies) && (
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                {step.owner && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {step.owner}
                                  </div>
                                )}
                                {step.timeline && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {step.timeline}
                                  </div>
                                )}
                                {step.dependencies && step.dependencies.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <ArrowRight className="h-3 w-3" />
                                    Depends: {step.dependencies.join(", ")}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Answered Questions */}
        {brainstormResults.answered_questions && brainstormResults.answered_questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Questions Resolved ({brainstormResults.answered_questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {brainstormResults.answered_questions.map((qa, index) => (
                  <Card 
                    key={index} 
                    className="border-l-4 border-l-blue-400 cursor-pointer hover:shadow-md transition-shadow" 
                    data-testid={`answered-question-${index}`}
                    onClick={() => handleItemClick('question', qa, index)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-medium text-foreground text-sm">{qa.original_question}</h4>
                          <Badge variant="outline" className={getConfidenceColor(qa.confidence)}>
                            {qa.confidence} confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{qa.answer}</p>
                        {qa.supporting_evidence && qa.supporting_evidence.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Supporting Evidence:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {qa.supporting_evidence.map((evidence, evidenceIndex) => (
                                <li key={evidenceIndex} className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  {evidence}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Implementation Strategy */}
        {brainstormResults.implementation_strategy && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Implementation Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Approach</h4>
                  <p className="text-sm text-muted-foreground">
                    {brainstormResults.implementation_strategy.approach}
                  </p>
                </div>

                {brainstormResults.implementation_strategy.key_milestones && 
                 brainstormResults.implementation_strategy.key_milestones.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Key Milestones</h4>
                    <ul className="space-y-1">
                      {brainstormResults.implementation_strategy.key_milestones.map((milestone, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {brainstormResults.implementation_strategy.success_metrics && 
                 brainstormResults.implementation_strategy.success_metrics.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Success Metrics</h4>
                    <ul className="space-y-1">
                      {brainstormResults.implementation_strategy.success_metrics.map((metric, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Target className="h-3 w-3 text-blue-500" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {brainstormResults.implementation_strategy.risk_mitigation && 
                 brainstormResults.implementation_strategy.risk_mitigation.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Risk Mitigation</h4>
                    <ul className="space-y-1">
                      {brainstormResults.implementation_strategy.risk_mitigation.map((risk, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-orange-500" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Telemetry */}
        {brainstormResults.telemetry && (
          <Card className="bg-muted/20">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div>Quality Score: {Math.round(brainstormResults.telemetry.quality * 100)}%</div>
                <div>Processing Time: {brainstormResults.telemetry.avg_ms}ms</div>
                <div>Agents: {brainstormResults.telemetry.active_agents || 4}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
    
    {/* Deep Dive Dialog */}
    <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedItem?.type === 'solution' && <Lightbulb className="h-5 w-5 text-yellow-500" />}
            {selectedItem?.type === 'action' && <CheckCircle className="h-5 w-5 text-green-500" />}
            {selectedItem?.type === 'question' && <MessageSquare className="h-5 w-5 text-blue-500" />}
            Deep Dive: {selectedItem?.item?.title || selectedItem?.item?.original_question || `Step ${selectedItem?.item?.step}`}
          </DialogTitle>
          <DialogDescription>
            Explore this {selectedItem?.type} in detail and ask follow-up questions for deeper insights.
          </DialogDescription>
        </DialogHeader>
        
        {selectedItem && (
          <div className="space-y-6">
            {/* Item Details */}
            <div className="space-y-3">
              <h4 className="font-medium">Details</h4>
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                {selectedItem.type === 'solution' && (
                  <>
                    <div className="flex gap-2 mb-2">
                      <Badge className={getFeasibilityColor(selectedItem.item.feasibility)}>
                        {selectedItem.item.feasibility} feasibility
                      </Badge>
                      <Badge className={getImpactColor(selectedItem.item.impact)}>
                        {selectedItem.item.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm">{selectedItem.item.description}</p>
                    {selectedItem.item.timeline && (
                      <p className="text-xs text-muted-foreground">Timeline: {selectedItem.item.timeline}</p>
                    )}
                    {selectedItem.item.resources_required?.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Resources: {selectedItem.item.resources_required.join(", ")}
                      </p>
                    )}
                  </>
                )}
                
                {selectedItem.type === 'action' && (
                  <>
                    <p className="text-sm">{selectedItem.item.description}</p>
                    {selectedItem.item.owner && (
                      <p className="text-xs text-muted-foreground">Owner: {selectedItem.item.owner}</p>
                    )}
                    {selectedItem.item.timeline && (
                      <p className="text-xs text-muted-foreground">Timeline: {selectedItem.item.timeline}</p>
                    )}
                    {selectedItem.item.dependencies?.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Dependencies: {selectedItem.item.dependencies.join(", ")}
                      </p>
                    )}
                  </>
                )}
                
                {selectedItem.type === 'question' && (
                  <>
                    <p className="text-sm font-medium">Q: {selectedItem.item.original_question}</p>
                    <p className="text-sm">A: {selectedItem.item.answer}</p>
                    <Badge variant="outline" className={getConfidenceColor(selectedItem.item.confidence)}>
                      {selectedItem.item.confidence} confidence
                    </Badge>
                    {selectedItem.item.supporting_evidence?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Supporting Evidence:</p>
                        <ul className="text-xs space-y-1">
                          {selectedItem.item.supporting_evidence.map((evidence: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500">•</span>
                              {evidence}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* Follow-up Questions */}
            <div className="space-y-3">
              <h4 className="font-medium">Ask Follow-up Questions</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="followup-question">Your Question</Label>
                  <Textarea
                    id="followup-question"
                    placeholder={`Ask a deeper question about this ${selectedItem.type}...`}
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleAskFollowUp}
                  disabled={!followUpQuestion.trim() || isAsking}
                  className="gap-2"
                >
                  {isAsking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Asking...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      Ask Question
                    </>
                  )}
                </Button>
              </div>
              
              {/* Follow-up Answer */}
              {followUpAnswer && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-l-blue-400">
                  <h5 className="font-medium text-sm mb-2">Follow-up Insights</h5>
                  <p className="text-sm text-muted-foreground">{followUpAnswer}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  </div>
  );
}