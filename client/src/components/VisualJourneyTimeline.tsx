import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Brain, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending" | "failed";
  timestamp?: Date;
  duration?: number;
  coverage?: number;
  participants?: string[];
  insights?: string[];
  confidence?: number;
}

interface VisualJourneyTimelineProps {
  steps?: JourneyStep[];
  isActive?: boolean;
  overallProgress?: number;
  coverageMetrics?: {
    topicCoverage: number;
    perspectiveDiversity: number;
    evidenceQuality: number;
    consensusStrength: number;
  };
}

const defaultSteps: JourneyStep[] = [
  {
    id: "analysis-start",
    title: "Analysis Initialization",
    description: "Setting up AI agents and processing framework",
    status: "completed",
    timestamp: new Date(Date.now() - 300000),
    duration: 2.5,
    coverage: 100,
    participants: ["System"],
    insights: ["Framework configured", "Agents selected"],
    confidence: 95
  },
  {
    id: "prompt-analysis",
    title: "Prompt Analysis & Context Mapping",
    description: "Understanding question scope and identifying key discussion areas",
    status: "completed", 
    timestamp: new Date(Date.now() - 240000),
    duration: 8.2,
    coverage: 85,
    participants: ["Analyst"],
    insights: ["Core themes identified", "Context boundaries mapped"],
    confidence: 88
  },
  {
    id: "perspective-gathering",
    title: "Multi-Perspective Analysis",
    description: "Gathering diverse viewpoints and critical assessments",
    status: "completed",
    timestamp: new Date(Date.now() - 180000),
    duration: 15.7,
    coverage: 92,
    participants: ["Analyst", "Critic", "Domain Expert"],
    insights: ["3 major perspectives", "2 critical gaps identified", "Evidence base established"],
    confidence: 82
  },
  {
    id: "synthesis",
    title: "Consensus Building & Synthesis",
    description: "Integrating perspectives and building coherent conclusions",
    status: "in_progress",
    timestamp: new Date(Date.now() - 60000),
    duration: 12.3,
    coverage: 78,
    participants: ["Synthesizer", "All Agents"],
    insights: ["Common ground identified", "Remaining conflicts mapped"],
    confidence: 75
  },
  {
    id: "validation",
    title: "Fact-Checking & Validation",
    description: "Verifying claims and ensuring accuracy of conclusions",
    status: "pending",
    coverage: 0,
    participants: ["Fact-Checker"],
    confidence: 0
  },
  {
    id: "final-output",
    title: "Final Report Generation",
    description: "Compiling comprehensive analysis with citations and dissents",
    status: "pending",
    coverage: 0,
    participants: ["System"],
    confidence: 0
  }
];

export function VisualJourneyTimeline({ 
  steps = defaultSteps, 
  isActive = false,
  overallProgress = 65,
  coverageMetrics = {
    topicCoverage: 85,
    perspectiveDiversity: 78,
    evidenceQuality: 82,
    consensusStrength: 69
  }
}: VisualJourneyTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted bg-background" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700";
      case "in_progress":
        return "bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700";
      case "failed":
        return "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700";
      default:
        return "bg-muted border-muted-foreground/20";
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    return `${(seconds / 60).toFixed(1)}m`;
  };

  const formatTimestamp = (timestamp: Date) => {
    const diff = (currentTime.getTime() - timestamp.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return timestamp.toLocaleTimeString();
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-primary" size={20} />
            Visual Journey Timeline
            {isActive && <Badge variant="secondary" className="animate-pulse">Live</Badge>}
          </div>
          <div className="text-sm text-muted-foreground">
            {overallProgress}% Complete
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analysis Progress</span>
            <span className="font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Coverage Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {coverageMetrics.topicCoverage}%
            </div>
            <div className="text-xs text-muted-foreground">Topic Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {coverageMetrics.perspectiveDiversity}%
            </div>
            <div className="text-xs text-muted-foreground">Perspective Diversity</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {coverageMetrics.evidenceQuality}%
            </div>
            <div className="text-xs text-muted-foreground">Evidence Quality</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {coverageMetrics.consensusStrength}%
            </div>
            <div className="text-xs text-muted-foreground">Consensus Strength</div>
          </div>
        </div>

        {/* Journey Steps */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted" />
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step Marker */}
                <div className="absolute left-4 w-4 h-4 bg-background border-2 border-current rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>

                {/* Step Content */}
                <div className="ml-12">
                  <Collapsible
                    open={expandedSteps.has(step.id)}
                    onOpenChange={() => toggleStep(step.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full p-4 border-2 rounded-lg text-left h-auto ${getStatusColor(step.status)}`}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              {getStatusIcon(step.status)}
                              <h3 className="font-semibold">{step.title}</h3>
                              {step.coverage !== undefined && (
                                <Badge variant="outline" className="ml-auto">
                                  {step.coverage}% coverage
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                            {step.timestamp && (
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{formatTimestamp(step.timestamp)}</span>
                                {step.duration && <span>Duration: {formatDuration(step.duration)}</span>}
                                {step.confidence !== undefined && (
                                  <span>Confidence: {step.confidence}%</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            {expandedSteps.has(step.id) ? 
                              <ChevronUp size={16} /> : 
                              <ChevronDown size={16} />
                            }
                          </div>
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="mt-3 p-4 bg-background/50 rounded-lg border space-y-3">
                        {step.participants && step.participants.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                              <Users size={14} />
                              Participants
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {step.participants.map((participant, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {participant}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {step.insights && step.insights.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                              <Eye size={14} />
                              Key Insights
                            </h4>
                            <ul className="space-y-1">
                              {step.insights.map((insight, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {step.coverage !== undefined && step.coverage > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Step Coverage</h4>
                            <Progress value={step.coverage} className="h-2" />
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}