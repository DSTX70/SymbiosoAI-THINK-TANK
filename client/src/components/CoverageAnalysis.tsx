import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Target,
  Eye,
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  MinusCircle,
  ArrowRight,
  Lightbulb
} from "lucide-react";

interface TopicArea {
  id: string;
  name: string;
  coverage: number;
  importance: number;
  perspectives: number;
  consensus: number;
  gaps: string[];
  strengths: string[];
}

interface PerspectiveMetrics {
  id: string;
  name: string;
  representation: number;
  quality: number;
  uniqueness: number;
  influence: number;
}

interface CoverageGap {
  type: "missing_perspective" | "insufficient_evidence" | "unexplored_angle" | "surface_treatment";
  description: string;
  impact: "high" | "medium" | "low";
  recommendations: string[];
}

interface CoverageAnalysisProps {
  topicAreas?: TopicArea[];
  perspectives?: PerspectiveMetrics[];
  gaps?: CoverageGap[];
  overallMetrics?: {
    comprehensiveness: number;
    balance: number;
    depth: number;
    novelty: number;
  };
}

const defaultTopicAreas: TopicArea[] = [
  {
    id: "technical-aspects",
    name: "Technical Implementation",
    coverage: 85,
    importance: 90,
    perspectives: 3,
    consensus: 75,
    gaps: ["Scalability concerns", "Security implications"],
    strengths: ["Clear technical requirements", "Implementation feasibility"]
  },
  {
    id: "business-impact",
    name: "Business Impact & ROI",
    coverage: 78,
    importance: 95,
    perspectives: 4,
    consensus: 82,
    gaps: ["Long-term market effects"],
    strengths: ["Financial projections", "Risk assessment", "Market analysis"]
  },
  {
    id: "user-experience",
    name: "User Experience & Adoption",
    coverage: 65,
    importance: 85,
    perspectives: 2,
    consensus: 60,
    gaps: ["Accessibility considerations", "User training needs", "Change management"],
    strengths: ["User journey mapping"]
  },
  {
    id: "regulatory-compliance",
    name: "Regulatory & Compliance",
    coverage: 45,
    importance: 75,
    perspectives: 1,
    consensus: 90,
    gaps: ["International regulations", "Data privacy laws", "Industry standards"],
    strengths: ["Basic compliance framework"]
  },
  {
    id: "competitive-landscape",
    name: "Competitive Analysis",
    coverage: 70,
    importance: 70,
    perspectives: 2,
    consensus: 85,
    gaps: ["Emerging competitors"],
    strengths: ["Market positioning", "Competitive advantages"]
  }
];

const defaultPerspectives: PerspectiveMetrics[] = [
  {
    id: "analyst",
    name: "Data Analyst",
    representation: 90,
    quality: 85,
    uniqueness: 75,
    influence: 80
  },
  {
    id: "pragmatist",
    name: "Business Pragmatist", 
    representation: 85,
    quality: 88,
    uniqueness: 70,
    influence: 85
  },
  {
    id: "innovator",
    name: "Innovation Strategist",
    representation: 75,
    quality: 82,
    uniqueness: 95,
    influence: 70
  },
  {
    id: "critic",
    name: "Critical Reviewer",
    representation: 80,
    quality: 90,
    uniqueness: 85,
    influence: 75
  }
];

const defaultGaps: CoverageGap[] = [
  {
    type: "missing_perspective",
    description: "Limited input from end-user representatives and customer success teams",
    impact: "high",
    recommendations: [
      "Include customer success manager perspective",
      "Add end-user feedback data",
      "Consider customer journey mapping"
    ]
  },
  {
    type: "insufficient_evidence",
    description: "Regulatory compliance analysis lacks specific industry precedents",
    impact: "medium", 
    recommendations: [
      "Research similar industry implementations",
      "Consult with compliance specialists",
      "Review regulatory case studies"
    ]
  },
  {
    type: "unexplored_angle",
    description: "Environmental impact and sustainability considerations not addressed",
    impact: "medium",
    recommendations: [
      "Include sustainability expert perspective",
      "Assess environmental footprint",
      "Consider ESG implications"
    ]
  }
];

const defaultMetrics = {
  comprehensiveness: 72,
  balance: 68,
  depth: 78,
  novelty: 65
};

export function CoverageAnalysis({ 
  topicAreas = defaultTopicAreas,
  perspectives = defaultPerspectives, 
  gaps = defaultGaps,
  overallMetrics = defaultMetrics
}: CoverageAnalysisProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topicMetrics = useMemo(() => {
    const totalImportance = topicAreas.reduce((sum, area) => sum + area.importance, 0);
    const weightedCoverage = topicAreas.reduce((sum, area) => 
      sum + (area.coverage * area.importance), 0) / totalImportance;
    
    const lowCoverageAreas = topicAreas.filter(area => area.coverage < 60);
    const highImportanceLowCoverage = topicAreas.filter(area => 
      area.importance >= 80 && area.coverage < 70);

    return {
      weightedCoverage: Math.round(weightedCoverage),
      lowCoverageAreas,
      highImportanceLowCoverage,
      avgConsensus: Math.round(topicAreas.reduce((sum, area) => sum + area.consensus, 0) / topicAreas.length)
    };
  }, [topicAreas]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300";
      case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300";
      case "low": return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300";
      default: return "text-muted-foreground";
    }
  };

  const getGapIcon = (type: string) => {
    switch (type) {
      case "missing_perspective": return <Users className="h-4 w-4" />;
      case "insufficient_evidence": return <AlertCircle className="h-4 w-4" />;
      case "unexplored_angle": return <Eye className="h-4 w-4" />;
      case "surface_treatment": return <Target className="h-4 w-4" />;
      default: return <MinusCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <BarChart3 className="text-primary" size={20} />
          Coverage Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="perspectives">Perspectives</TabsTrigger>
            <TabsTrigger value="gaps">Gaps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overall Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {overallMetrics.comprehensiveness}%
                </div>
                <div className="text-sm text-muted-foreground">Comprehensiveness</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {overallMetrics.balance}%
                </div>
                <div className="text-sm text-muted-foreground">Balance</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {overallMetrics.depth}%
                </div>
                <div className="text-sm text-muted-foreground">Depth</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {overallMetrics.novelty}%
                </div>
                <div className="text-sm text-muted-foreground">Novelty</div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Lightbulb size={18} />
                Key Insights
              </h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-green-800 dark:text-green-200">
                      Strong Technical & Business Analysis
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Technical implementation and business impact areas show excellent coverage (85%+ each)
                    </div>
                  </div>
                </div>

                {topicMetrics.highImportanceLowCoverage.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-yellow-800 dark:text-yellow-200">
                        High-Priority Areas Need Attention
                      </div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        {topicMetrics.highImportanceLowCoverage[0].name} is highly important but has limited coverage
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-200">
                      Weighted Coverage Score: {topicMetrics.weightedCoverage}%
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      Analysis quality adjusted for topic importance levels
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <div className="space-y-4">
              {topicAreas.map((topic) => (
                <div
                  key={topic.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTopic === topic.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/50'
                  }`}
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{topic.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Importance: {topic.importance}%
                      </Badge>
                      <Badge variant={topic.coverage >= 70 ? "default" : topic.coverage >= 50 ? "secondary" : "destructive"}>
                        {topic.coverage}% covered
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Coverage</div>
                        <Progress value={topic.coverage} className="h-2" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Consensus</div>
                        <Progress value={topic.consensus} className="h-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span className="text-sm">{topic.perspectives} perspectives</span>
                      </div>
                    </div>

                    {selectedTopic === topic.id && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        {topic.strengths.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                              <CheckCircle size={14} />
                              Strengths
                            </h4>
                            <div className="space-y-1">
                              {topic.strengths.map((strength, idx) => (
                                <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                  {strength}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {topic.gaps.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2 flex items-center gap-2">
                              <AlertCircle size={14} />
                              Areas for Improvement
                            </h4>
                            <div className="space-y-1">
                              {topic.gaps.map((gap, idx) => (
                                <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                                  {gap}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="perspectives" className="space-y-6">
            <div className="grid gap-4">
              {perspectives.map((perspective) => (
                <div key={perspective.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{perspective.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      Overall Score: {Math.round((perspective.representation + perspective.quality + perspective.uniqueness + perspective.influence) / 4)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Representation</div>
                      <div className="flex items-center gap-2">
                        <Progress value={perspective.representation} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{perspective.representation}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Quality</div>
                      <div className="flex items-center gap-2">
                        <Progress value={perspective.quality} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{perspective.quality}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Uniqueness</div>
                      <div className="flex items-center gap-2">
                        <Progress value={perspective.uniqueness} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{perspective.uniqueness}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Influence</div>
                      <div className="flex items-center gap-2">
                        <Progress value={perspective.influence} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{perspective.influence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gaps" className="space-y-6">
            <div className="space-y-4">
              {gaps.map((gap, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getGapIcon(gap.type)}
                      <div>
                        <h3 className="font-semibold capitalize">
                          {gap.type.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {gap.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getImpactColor(gap.impact)} border-0`}>
                      {gap.impact} impact
                    </Badge>
                  </div>

                  <div className="ml-6">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <ArrowRight size={14} />
                      Recommendations
                    </h4>
                    <div className="space-y-1">
                      {gap.recommendations.map((rec, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {gaps.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">No Coverage Gaps Detected</h3>
                <p className="text-muted-foreground">
                  The analysis appears comprehensive across all major topic areas and perspectives.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}