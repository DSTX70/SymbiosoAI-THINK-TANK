import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Compass, Rocket, SlidersHorizontal, Cog, Zap } from "lucide-react";
import Header from "@/components/Header";
import TelemetryPanel from "@/components/TelemetryPanel";
import ResultsSection from "@/components/ResultsSection";
import LiveStreamingSection, { createStreamUrl } from "@/components/LiveStreamingSection";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThinkRequest, ThinkResponse } from "@shared/schema";

export default function GuidedPage() {
  const [prompt, setPrompt] = useState("");
  const [selectionMode, setSelectionMode] = useState("smart");
  const [responseLength, setResponseLength] = useState("moderate");
  const [rounds, setRounds] = useState(3);
  const [debateFormat, setDebateFormat] = useState("structured");
  const [requireEvidence, setRequireEvidence] = useState(true);
  const [requireCounterarguments, setRequireCounterarguments] = useState(true);
  const [requireCitations, setRequireCitations] = useState(false);
  const [enableFactCheck, setEnableFactCheck] = useState(false);
  const [enableLiveWeb, setEnableLiveWeb] = useState(false);
  const [useStreaming, setUseStreaming] = useState(true);
  const [minSources, setMinSources] = useState(3);
  
  // Agent selection subchoices
  const [manualAgents, setManualAgents] = useState<("analyst" | "pragmatist" | "innovator" | "thoughtful" | "critic")[]>(["analyst", "critic"]);
  const [domainExperts, setDomainExperts] = useState<string[]>([]);
  const [useCaseType, setUseCaseType] = useState<"strategic_planning" | "risk_analysis" | "innovation_review" | "decision_making" | "problem_solving" | "research_synthesis" | "ethical_review" | "market_research">("strategic_planning");
  const [results, setResults] = useState<ThinkResponse | null>(null);
  const [streamingResult, setStreamingResult] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const thinkMutation = useMutation({
    mutationFn: async (data: ThinkRequest) => {
      const response = await apiRequest("POST", "/api/think", data);
      return response.json();
    },
    onSuccess: (data: ThinkResponse) => {
      setResults(data);
      toast({ description: "Guided analysis completed successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to process guided analysis" 
      });
    },
  });

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast({ 
        variant: "destructive",
        description: "Please enter a prompt to analyze" 
      });
      return;
    }

    if (useStreaming) {
      handleStreamingSubmit();
    } else {
      const requestData: ThinkRequest = {
        prompt: prompt.trim(),
        mode: "guided",
        selection_mode: selectionMode as any,
        manual_agents: selectionMode === "manual" ? manualAgents : undefined,
        domain_experts: selectionMode === "domain" ? domainExperts as any : undefined,
        usecase_type: selectionMode === "usecase" ? useCaseType : undefined,
        response_length: responseLength as any,
        turns: rounds,
        debate_format: debateFormat as any,
        require_evidence: requireEvidence,
        require_counterarguments: requireCounterarguments,
        require_citations: requireCitations,
        enable_fact_check: enableFactCheck,
        live_web: enableLiveWeb,
        verification: {
          fact_check: enableFactCheck,
          min_sources: minSources,
        },
      };

      thinkMutation.mutate(requestData);
    }
  };

  const handleStreamingSubmit = () => {
    const settings = {
      mode: "guided",
      selection_mode: selectionMode,
      manual_agents: selectionMode === "manual" ? manualAgents : undefined,
      domain_experts: selectionMode === "domain" ? domainExperts : undefined,
      usecase_type: selectionMode === "usecase" ? useCaseType : undefined,
      response_length: responseLength,
      turns: rounds.toString(),
      debate_format: debateFormat,
      require_evidence: requireEvidence,
      require_counterarguments: requireCounterarguments,
      require_citations: requireCitations,
      enable_fact_check: enableFactCheck,
      live_web: enableLiveWeb,
      min_sources: minSources.toString(),
    };

    setIsStreaming(true);
    setStreamingResult(null);
    setResults(null);

    const streamUrl = createStreamUrl(prompt, settings);
    const eventSource = new EventSource(streamUrl);

    eventSource.addEventListener("final", (event) => {
      const data = JSON.parse(event.data);
      setStreamingResult(data);
      setResults({
        consensus: data.consensus,
        dissents: data.dissents,
        unresolved: data.unresolved,
        citations: data.citations,
        fact_check: data.fact_check,
        telemetry: data.telemetry
      });
      setIsStreaming(false);
      eventSource.close();
      toast({ description: "Guided streaming analysis completed successfully!" });
    });

    eventSource.onerror = () => {
      setIsStreaming(false);
      eventSource.close();
      toast({ 
        variant: "destructive",
        description: "Streaming failed" 
      });
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Configuration Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <SlidersHorizontal className="text-primary" size={20} />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="selection-mode" className="text-sm font-medium">AI Selection Mode</Label>
                  <Select value={selectionMode} onValueChange={setSelectionMode}>
                    <SelectTrigger data-testid="select-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart">
                        <div className="space-y-1">
                          <div className="font-medium">Smart Selection</div>
                          <div className="text-xs text-muted-foreground">AI automatically selects optimal agents based on your prompt</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="manual">
                        <div className="space-y-1">
                          <div className="font-medium">Manual</div>
                          <div className="text-xs text-muted-foreground">Choose exactly which AI agents participate in the debate</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="domain">
                        <div className="space-y-1">
                          <div className="font-medium">Domain Expert</div>
                          <div className="text-xs text-muted-foreground">Focus on specialized knowledge in specific fields</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="usecase">
                        <div className="space-y-1">
                          <div className="font-medium">Use Case Driven</div>
                          <div className="text-xs text-muted-foreground">Optimize agent behavior for specific analytical goals</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Manual Agent Selection */}
                {selectionMode === "manual" && (
                  <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Label className="text-sm font-medium text-blue-900 dark:text-blue-100">Select Agents</Label>
                    <div className="space-y-2">
                      {[
                        { 
                          id: "analyst", 
                          label: "🔍 The Analyst", 
                          specialty: "Analytical thinking and data-driven insights",
                          bestFor: "Business analysis, technical debates, document review",
                          description: "Statistical analysis, evidence-based reasoning, systematic problem breakdown"
                        },
                        { 
                          id: "pragmatist", 
                          label: "🛠️ The Pragmatist", 
                          specialty: "Implementation-focused solutions and realistic planning",
                          bestFor: "Business decisions, implementation planning, practical problem-solving",
                          description: "Real-world constraints, feasibility assessment, cost-benefit analysis"
                        },
                        { 
                          id: "innovator", 
                          label: "💡 The Innovator", 
                          specialty: "Creative thinking and breakthrough solutions",
                          bestFor: "Creative projects, innovation challenges, disruptive thinking",
                          description: "Out-of-the-box approaches, creative methodologies, experimental strategies"
                        },
                        { 
                          id: "thoughtful", 
                          label: "🤔 The Thoughtful One", 
                          specialty: "Balanced perspectives and ethical considerations",
                          bestFor: "Ethical discussions, complex social issues, multi-party considerations",
                          description: "Stakeholder analysis, ethical frameworks, nuanced decision-making"
                        },
                        { 
                          id: "critic", 
                          label: "🔍 The Critic", 
                          specialty: "Risk assessment and quality assurance",
                          bestFor: "Risk analysis, quality review, identifying potential problems",
                          description: "Vulnerability analysis, stress-testing, devil's advocate perspectives"
                        }
                      ].map(agent => (
                        <div key={agent.id} className="space-y-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start space-x-3">
                            <Switch
                              id={`agent-${agent.id}`}
                              checked={manualAgents.includes(agent.id as "analyst" | "pragmatist" | "innovator" | "thoughtful" | "critic")}
                              onCheckedChange={(checked) => {
                                const agentId = agent.id as "analyst" | "pragmatist" | "innovator" | "thoughtful" | "critic";
                                if (checked) {
                                  setManualAgents(prev => [...prev, agentId]);
                                } else {
                                  setManualAgents(prev => prev.filter(a => a !== agentId));
                                }
                              }}
                              data-testid={`switch-agent-${agent.id}`}
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-1">
                              <Label htmlFor={`agent-${agent.id}`} className="text-sm cursor-pointer">
                                <div className="font-medium">{agent.label}</div>
                                <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1">{agent.specialty}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  <strong>Unique Knowledge:</strong> {agent.description}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  <strong>Best for:</strong> {agent.bestFor}
                                </div>
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Domain Expert Selection */}
                {selectionMode === "domain" && (
                  <div className="space-y-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Label className="text-sm font-medium text-green-900 dark:text-green-100">👨‍⚖️ Select Domain Experts</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      
                      {/* Legal Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">⚖️ Legal</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("legal-analyst")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "legal-analyst"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "legal-analyst"));
                                }
                              }}
                              data-testid="switch-legal-analyst"
                            />
                            <span>The Legal Analyst - Contract analysis, legal precedent, regulatory compliance</span>
                          </Label>
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("legal-advocate")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "legal-advocate"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "legal-advocate"));
                                }
                              }}
                              data-testid="switch-legal-advocate"
                            />
                            <span>The Legal Advocate - Argumentation, legal strategy, client advocacy</span>
                          </Label>
                        </div>
                      </div>

                      {/* Medical Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">🏥 Medical</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("medical-diagnostician")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "medical-diagnostician"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "medical-diagnostician"));
                                }
                              }}
                              data-testid="switch-medical-diagnostician"
                            />
                            <span>The Medical Diagnostician - Symptom analysis, clinical diagnostics, differential diagnosis, symptom patterns</span>
                          </Label>
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("medical-researcher")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "medical-researcher"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "medical-researcher"));
                                }
                              }}
                              data-testid="switch-medical-researcher"
                            />
                            <span>The Medical Researcher - Clinical trials, medical literature research, systematic reviews, meta-analysis</span>
                          </Label>
                        </div>
                      </div>

                      {/* Finance Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">💰 Finance</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("financial-analyst")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "financial-analyst"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "financial-analyst"));
                                }
                              }}
                              data-testid="switch-financial-analyst"
                            />
                            <span>The Financial Analyst - Financial modeling, investment analysis, risk assessment</span>
                          </Label>
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("investment-strategist")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "investment-strategist"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "investment-strategist"));
                                }
                              }}
                              data-testid="switch-investment-strategist"
                            />
                            <span>The Investment Strategist - Portfolio strategy, asset allocation, market psychology</span>
                          </Label>
                        </div>
                      </div>

                      {/* Technology Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">💻 Technology</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("tech-architect")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "tech-architect"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "tech-architect"));
                                }
                              }}
                              data-testid="switch-tech-architect"
                            />
                            <span>The Tech Architect - System design, scalability, security</span>
                          </Label>
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("devops-engineer")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "devops-engineer"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "devops-engineer"));
                                }
                              }}
                              data-testid="switch-devops-engineer"
                            />
                            <span>The DevOps Engineer - CI/CD, infrastructure, automation</span>
                          </Label>
                        </div>
                      </div>

                      {/* Education Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">🎓 Education</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("educational-psychologist")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "educational-psychologist"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "educational-psychologist"));
                                }
                              }}
                              data-testid="switch-educational-psychologist"
                            />
                            <span>The Educational Psychologist - Learning theory, cognitive development</span>
                          </Label>
                        </div>
                      </div>

                      {/* Marketing Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">📢 Marketing</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("brand-strategist")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "brand-strategist"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "brand-strategist"));
                                }
                              }}
                              data-testid="switch-brand-strategist"
                            />
                            <span>The Brand Strategist - Brand positioning, consumer psychology</span>
                          </Label>
                        </div>
                      </div>

                      {/* Scientific Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">🔬 Scientific</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("research-scientist")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "research-scientist"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "research-scientist"));
                                }
                              }}
                              data-testid="switch-research-scientist"
                            />
                            <span>The Research Scientist - Experimental design, data analysis</span>
                          </Label>
                        </div>
                      </div>

                      {/* Engineering Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">⚙️ Engineering</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("systems-engineer")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "systems-engineer"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "systems-engineer"));
                                }
                              }}
                              data-testid="switch-systems-engineer"
                            />
                            <span>The Systems Engineer - Systems thinking, optimization, safety analysis</span>
                          </Label>
                        </div>
                      </div>

                      {/* Psychology Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">🧠 Psychology</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("behavioral-analyst")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "behavioral-analyst"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "behavioral-analyst"));
                                }
                              }}
                              data-testid="switch-behavioral-analyst"
                            />
                            <span>The Behavioral Analyst - Human behavior, cognitive biases, decision-making</span>
                          </Label>
                        </div>
                      </div>

                      {/* Sustainability Domain */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                        <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">🌱 Sustainability</h5>
                        <div className="space-y-2">
                          <Label className="flex items-center space-x-2 text-sm cursor-pointer">
                            <Switch 
                              checked={domainExperts.includes("sustainability-consultant")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setDomainExperts(prev => [...prev, "sustainability-consultant"]);
                                } else {
                                  setDomainExperts(prev => prev.filter(e => e !== "sustainability-consultant"));
                                }
                              }}
                              data-testid="switch-sustainability-consultant"
                            />
                            <span>The Sustainability Consultant - Environmental impact, ESG, circular economy</span>
                          </Label>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Use Case Selection */}
                {selectionMode === "usecase" && (
                  <div className="space-y-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Label className="text-sm font-medium text-purple-900 dark:text-purple-100">Analysis Use Case</Label>
                    <Select value={useCaseType} onValueChange={(value) => setUseCaseType(value as typeof useCaseType)}>
                      <SelectTrigger data-testid="select-usecase">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strategic_planning">
                          <div className="space-y-1">
                            <div className="font-medium">Strategic Planning</div>
                            <div className="text-xs text-muted-foreground">Long-term vision, competitive positioning, resource allocation</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="risk_analysis">
                          <div className="space-y-1">
                            <div className="font-medium">Risk Analysis</div>
                            <div className="text-xs text-muted-foreground">Threat assessment, vulnerability analysis, mitigation strategies</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="innovation_review">
                          <div className="space-y-1">
                            <div className="font-medium">Innovation Review</div>
                            <div className="text-xs text-muted-foreground">Technology evaluation, market readiness, innovation potential</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="decision_making">
                          <div className="space-y-1">
                            <div className="font-medium">Decision Making</div>
                            <div className="text-xs text-muted-foreground">Options analysis, criteria evaluation, outcome prediction</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="problem_solving">
                          <div className="space-y-1">
                            <div className="font-medium">Problem Solving</div>
                            <div className="text-xs text-muted-foreground">Root cause analysis, solution design, implementation planning</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="research_synthesis">
                          <div className="space-y-1">
                            <div className="font-medium">Research Synthesis</div>
                            <div className="text-xs text-muted-foreground">Literature review, evidence integration, research gaps</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="ethical_review">
                          <div className="space-y-1">
                            <div className="font-medium">Ethical Review</div>
                            <div className="text-xs text-muted-foreground">Moral implications, stakeholder impact, ethical frameworks</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="market_research">
                          <div className="space-y-1">
                            <div className="font-medium">Market Research</div>
                            <div className="text-xs text-muted-foreground">Consumer insights, market trends, competitive landscape</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="response-length" className="text-sm font-medium">Response Depth</Label>
                  <Select value={responseLength} onValueChange={setResponseLength}>
                    <SelectTrigger data-testid="select-length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rounds" className="text-sm font-medium">Debate Rounds</Label>
                  <Input
                    id="rounds"
                    type="number"
                    min={1}
                    max={10}
                    value={rounds}
                    onChange={(e) => setRounds(parseInt(e.target.value) || 3)}
                    data-testid="input-rounds"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="debate-format" className="text-sm font-medium">Debate Format</Label>
                  <Select value={debateFormat} onValueChange={setDebateFormat}>
                    <SelectTrigger data-testid="select-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="structured">Structured</SelectItem>
                      <SelectItem value="socratic">Socratic</SelectItem>
                      <SelectItem value="collaborative">Collaborative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Analysis Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="evidence"
                        checked={requireEvidence}
                        onCheckedChange={setRequireEvidence}
                        data-testid="switch-evidence"
                      />
                      <Label htmlFor="evidence" className="text-sm">Require Evidence</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="counterarguments"
                        checked={requireCounterarguments}
                        onCheckedChange={setRequireCounterarguments}
                        data-testid="switch-counter"
                      />
                      <Label htmlFor="counterarguments" className="text-sm">Counter-arguments</Label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Verification</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="citations-guided"
                        checked={requireCitations}
                        onCheckedChange={setRequireCitations}
                        data-testid="switch-cite"
                      />
                      <Label htmlFor="citations-guided" className="text-sm">Require Citations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="factcheck-guided"
                        checked={enableFactCheck}
                        onCheckedChange={setEnableFactCheck}
                        data-testid="switch-fact"
                      />
                      <Label htmlFor="factcheck-guided" className="text-sm">Fact-checking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="liveweb-guided"
                        checked={enableLiveWeb}
                        onCheckedChange={setEnableLiveWeb}
                        data-testid="switch-liveweb-guided"
                      />
                      <Label htmlFor="liveweb-guided" className="text-sm">Live Web Search</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="streaming-guided"
                        checked={useStreaming}
                        onCheckedChange={setUseStreaming}
                        data-testid="switch-streaming-guided"
                      />
                      <Label htmlFor="streaming-guided" className="text-sm">Real-time Streaming</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="min-sources" className="text-sm font-medium">Min Sources</Label>
                      <Input
                        id="min-sources"
                        type="number"
                        min={0}
                        max={10}
                        value={minSources}
                        onChange={(e) => setMinSources(parseInt(e.target.value) || 3)}
                        data-testid="input-minsrc"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Prompt Card */}
            <Card className="card-elevated gradient-bg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Compass className="text-primary" size={20} />
                  Guided Analysis Prompt
                  <div className={`status-indicator ${thinkMutation.isPending ? "status-processing" : results ? "status-complete" : "status-idle"}`} data-testid="status-guided"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Describe your complex challenge for guided multi-agent analysis..."
                  className="resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  data-testid="input-guided-prompt"
                />
                
                <Button 
                  onClick={handleSubmit}
                  disabled={thinkMutation.isPending || isStreaming}
                  className="btn-primary flex items-center gap-2"
                  data-testid="button-guided-run"
                >
                  {(thinkMutation.isPending || isStreaming) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      {isStreaming ? "Streaming..." : "Analyzing..."}
                    </>
                  ) : (
                    <>
                      {useStreaming ? <Zap size={16} /> : <Rocket size={16} />}
                      {useStreaming ? "Launch Live Stream" : "Launch Guided Analysis"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Live Streaming Section */}
            {useStreaming && (
              <LiveStreamingSection
                onStartStream={handleStreamingSubmit}
                isStreaming={isStreaming}
                streamingResult={streamingResult}
              />
            )}

            {/* Analysis Progress */}
            {thinkMutation.isPending && (
              <Card className="card-elevated mb-6 processing-state">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Cog className="animate-spin text-primary" size={20} />
                    Analysis in Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Round 1: Initial Analysis</span>
                    <span className="text-secondary font-medium">Complete</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Round 2: Critical Review</span>
                    <span className="text-secondary font-medium">Complete</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Round 3: Synthesis</span>
                    <span className="text-primary font-medium">Processing...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Section */}
            <ResultsSection
              consensus={results?.consensus}
              dissents={results?.dissents}
              unresolved={results?.unresolved}
              citations={results?.citations}
              isVisible={!!results}
            />
          </div>

          {/* Telemetry Sidebar */}
          <aside>
            <TelemetryPanel 
              telemetry={results?.telemetry}
              isProcessing={thinkMutation.isPending}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
