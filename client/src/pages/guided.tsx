import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compass, Rocket, Zap, Bot, Users, UserCheck, BookOpen, Briefcase } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TelemetryPanel from "@/components/TelemetryPanel";
import ResultsSection from "@/components/ResultsSection";
import LiveStreamingSection from "@/components/LiveStreamingSection";
import { createStreamUrl } from "@/lib/streamUtils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { ThinkRequest, ThinkResponse } from "@shared/schema";

export default function GuidedPage() {
  const [prompt, setPrompt] = useState("");
  const [requireCitations, setRequireCitations] = useState(false);
  const [enableFactCheck, setEnableFactCheck] = useState(false);
  const [enableLiveWeb, setEnableLiveWeb] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic">("openai");
  
  // Agent Selection State
  const [selectionMode, setSelectionMode] = useState<"smart" | "manual" | "domain" | "usecase">("smart");
  const [manualAgents, setManualAgents] = useState<("analyst" | "pragmatist" | "innovator" | "thoughtful" | "critic")[]>([]);
  const [domainExperts, setDomainExperts] = useState<("legal-analyst" | "legal-advocate" | "medical-diagnostician" | "medical-researcher" | "financial-analyst" | "investment-strategist" | "tech-architect" | "devops-engineer" | "educational-psychologist" | "brand-strategist" | "research-scientist" | "systems-engineer" | "behavioral-analyst" | "sustainability-consultant")[]>([]);
  const [usecaseType, setUsecaseType] = useState<"business_analysis" | "technical_debate" | "creative_brainstorm" | "research_synthesis" | "ethical_discussion" | "document_analysis" | "general_inquiry" | "">("");
  
  const [useStreaming, setUseStreaming] = useState(() => {
    console.log("GuidedPage: Initializing useStreaming to FALSE");
    return false;
  }); // FORCE DEFAULT OFF
  
  const [results, setResults] = useState<ThinkResponse | null>(null);
  const [streamingResult, setStreamingResult] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const { toast } = useToast();

  const thinkMutation = useMutation({
    mutationFn: async (data: ThinkRequest) => {
      const response = await apiRequest("POST", "/api/think", data);
      return response.json();
    },
    onSuccess: (data: ThinkResponse) => {
      setResults(data);
      toast({ description: "Collaborative analysis completed successfully!" });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sign in required",
          description: "Please sign in to start collaborative thinking",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 2000);
        return;
      }
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to process collaborative analysis" 
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
        selection_mode: selectionMode,
        manual_agents: selectionMode === "manual" ? manualAgents : undefined,
        domain_experts: selectionMode === "domain" ? domainExperts : undefined,
        usecase_type: selectionMode === "usecase" && usecaseType !== "" ? usecaseType as any : undefined,
        response_length: "moderate",
        turns: 1,
        debate_format: "collaborative",
        require_evidence: false,
        require_counterarguments: false,
        require_citations: requireCitations,
        enable_fact_check: enableFactCheck,
        live_web: enableLiveWeb,
        model_provider: selectedModel,
        verification: {
          fact_check: enableFactCheck,
          min_sources: 1,
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
      usecase_type: selectionMode === "usecase" && usecaseType !== "" ? usecaseType as any : undefined,
      response_length: "moderate",
      turns: "1",
      debate_format: "collaborative",
      require_evidence: false,
      require_counterarguments: false,
      require_citations: requireCitations,
      enable_fact_check: enableFactCheck,
      live_web: enableLiveWeb,
      model_provider: selectedModel,
      min_sources: "1",
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
      toast({ description: "Collaborative streaming analysis completed successfully!" });
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

  const handleQuestionClick = async (question: string) => {
    if (!results || isProcessingQuestion) return;

    setIsProcessingQuestion(true);
    setCurrentQuestion(question);
    toast({ description: `Exploring question: "${question}"...` });

    // Create a new debate with the clicked question as prompt
    const requestData: ThinkRequest = {
      prompt: question.trim(),
      mode: "guided",
      selection_mode: selectionMode,
      manual_agents: selectionMode === "manual" ? manualAgents : undefined,
      domain_experts: selectionMode === "domain" ? domainExperts : undefined,
      usecase_type: selectionMode === "usecase" && usecaseType !== "" ? usecaseType as any : undefined,
      response_length: "moderate",
      turns: 1,
      debate_format: "collaborative",
      require_evidence: false,
      require_counterarguments: false,
      require_citations: requireCitations,
      enable_fact_check: enableFactCheck,
      live_web: enableLiveWeb,
      model_provider: selectedModel,
      verification: {
        fact_check: enableFactCheck,
        min_sources: 1,
      },
    };

    try {
      const response = await apiRequest("POST", "/api/think", requestData);
      const newResults = await response.json() as ThinkResponse;

      console.log("Original results:", results);
      console.log("New results from question:", newResults);

      // Merge results: combine consensus, add dissents, merge unresolved (removing clicked question)
      const mergedResults: ThinkResponse = {
        consensus: results.consensus + 
          "\n\n" + 
          "═".repeat(50) + 
          "\n🔍 ADDITIONAL ANALYSIS: " + question + 
          "\n" + "═".repeat(50) + 
          "\n\n" + newResults.consensus,
        dissents: [
          ...(results.dissents || []),
          ...(newResults.dissents || []).map(dissent => ({
            ...dissent,
            position: `🔍 [From: ${question}] ${dissent.position}`,
            reasoning: dissent.reasoning
          }))
        ],
        unresolved: [
          ...(results.unresolved || []).filter(q => q !== question), // Remove clicked question
          ...(newResults.unresolved || []) // Add new unresolved questions
        ],
        citations: [...(results.citations || []), ...(newResults.citations || [])],
        fact_check: newResults.fact_check || results.fact_check,
        telemetry: newResults.telemetry || results.telemetry
      };

      console.log("Merged results:", mergedResults);
      console.log("Consensus length - Original:", results.consensus?.length, "Merged:", mergedResults.consensus?.length);

      setResults(mergedResults);
      toast({ description: `Question explored and results merged successfully!` });
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to explore question" 
      });
    } finally {
      setIsProcessingQuestion(false);
      setCurrentQuestion("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* 1. Collaborative Prompt */}
        <Card className="card-elevated gradient-bg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Compass className="text-primary" size={20} />
              Collaborative Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe your challenge for collaborative AI thinking..."
              className="resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              data-testid="input-collaborative-prompt"
            />
          </CardContent>
        </Card>

        {/* Agent Selection Section */}
        <Card className="card-elevated mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users className="text-primary" size={20} />
              Agent Selection & Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Experts</h3>
            <Tabs value={selectionMode} onValueChange={(value: string) => setSelectionMode(value as any)}>
              <TabsList className="grid w-full grid-cols-4 h-12 mb-4">
                <TabsTrigger value="smart" className="flex items-center gap-2 flex-1">
                  <Zap size={16} />
                  Smart
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2 flex-1">
                  <UserCheck size={16} />
                  Manual
                </TabsTrigger>
                <TabsTrigger value="domain" className="flex items-center gap-2 flex-1">
                  <Briefcase size={16} />
                  Domain
                </TabsTrigger>
                <TabsTrigger value="usecase" className="flex items-center gap-2 flex-1">
                  <BookOpen size={16} />
                  Use Case
                </TabsTrigger>
              </TabsList>

              <TabsContent value="smart" className="mt-4">
                <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                  <Zap className="mx-auto mb-2 text-muted-foreground" size={24} />
                  <h3 className="font-medium mb-1">Smart Agent Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    AI automatically selects the best agents for your prompt based on content analysis.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Select AI Personalities</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "analyst", name: "The Analyst", desc: "Data-driven insights and systematic analysis" },
                      { id: "pragmatist", name: "The Pragmatist", desc: "Implementation-focused and realistic solutions" },
                      { id: "innovator", name: "The Innovator", desc: "Creative thinking and breakthrough approaches" },
                      { id: "thoughtful", name: "The Thoughtful One", desc: "Balanced perspectives and ethical considerations" },
                      { id: "critic", name: "The Critic", desc: "Challenge assumptions and identify weaknesses" }
                    ].map((agent) => (
                      <div key={agent.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={agent.id}
                          checked={manualAgents.includes(agent.id as any)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setManualAgents([...manualAgents, agent.id as any]);
                            } else {
                              setManualAgents(manualAgents.filter(id => id !== agent.id));
                            }
                          }}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={agent.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {agent.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {agent.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="domain" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Select Domain Experts</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "legal-analyst", name: "Legal Analyst", desc: "Legal research and case analysis" },
                      { id: "legal-advocate", name: "Legal Advocate", desc: "Legal argumentation and advocacy" },
                      { id: "medical-diagnostician", name: "Medical Diagnostician", desc: "Clinical diagnosis and medical analysis" },
                      { id: "medical-researcher", name: "Medical Researcher", desc: "Medical research and clinical studies" },
                      { id: "financial-analyst", name: "Financial Analyst", desc: "Financial modeling and market analysis" },
                      { id: "investment-strategist", name: "Investment Strategist", desc: "Investment planning and portfolio strategy" },
                      { id: "tech-architect", name: "Tech Architect", desc: "System design and technical architecture" },
                      { id: "devops-engineer", name: "DevOps Engineer", desc: "Infrastructure and deployment strategies" },
                      { id: "educational-psychologist", name: "Educational Psychologist", desc: "Learning theory and educational strategies" },
                      { id: "brand-strategist", name: "Brand Strategist", desc: "Brand positioning and marketing strategy" },
                      { id: "research-scientist", name: "Research Scientist", desc: "Scientific methodology and research design" },
                      { id: "systems-engineer", name: "Systems Engineer", desc: "Complex systems analysis and optimization" },
                      { id: "behavioral-analyst", name: "Behavioral Analyst", desc: "Human behavior and decision-making patterns" },
                      { id: "sustainability-consultant", name: "Sustainability Consultant", desc: "Environmental impact and sustainable solutions" }
                    ].map((expert) => (
                      <div key={expert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={expert.id}
                          checked={domainExperts.includes(expert.id as any)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setDomainExperts([...domainExperts, expert.id as any]);
                            } else {
                              setDomainExperts(domainExperts.filter(id => id !== expert.id));
                            }
                          }}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor={expert.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {expert.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {expert.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="usecase" className="mt-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Select Use Case Type</h4>
                  <div className="grid gap-3">
                    {[
                      { id: "business_analysis", name: "Business Analysis", desc: "Market analysis, competitive positioning, and quantitative evaluation" },
                      { id: "technical_debate", name: "Technical Debate", desc: "Systematic technical analysis, challenge assumptions, and implementation feasibility" },
                      { id: "creative_brainstorm", name: "Creative Brainstorm", desc: "Generate creative solutions, evaluate feasibility, and consider stakeholder perspectives" },
                      { id: "research_synthesis", name: "Research Synthesis", desc: "Systematically review evidence, consider implications, and evaluate methodology" },
                      { id: "ethical_discussion", name: "Ethical Discussion", desc: "Explore ethical frameworks, challenge assumptions, and provide systematic moral reasoning" },
                      { id: "document_analysis", name: "Document Analysis", desc: "Systematically analyze content, evaluate claims, and provide structured insights" },
                      { id: "general_inquiry", name: "General Inquiry", desc: "Comprehensive analysis suitable for general questions and discussions" }
                    ].map((usecase) => (
                      <div 
                        key={usecase.id} 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          usecaseType === usecase.id 
                            ? "border-primary bg-primary/10" 
                            : "border-muted hover:border-primary/50"
                        }`}
                        onClick={() => setUsecaseType(usecase.id as any)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            usecaseType === usecase.id 
                              ? "border-primary bg-primary" 
                              : "border-muted"
                          }`} />
                          <div>
                            <h3 className="font-medium">{usecase.name}</h3>
                            <p className="text-sm text-muted-foreground">{usecase.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Compact Toggle Options */}
        <Card className="card-elevated mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Column 1 */}
              <div className="space-y-4">
                {/* Require Citations */}
                <div className="flex items-center space-x-3">
                  <Switch
                    id="citations"
                    checked={requireCitations}
                    onCheckedChange={setRequireCitations}
                    data-testid="switch-citations"
                  />
                  <Label htmlFor="citations" className="text-sm font-medium">Require Citations</Label>
                </div>

                {/* Live Web Search */}
                <div className="flex items-center space-x-3">
                  <Switch
                    id="liveweb"
                    checked={enableLiveWeb}
                    onCheckedChange={setEnableLiveWeb}
                    data-testid="switch-liveweb"
                  />
                  <Label htmlFor="liveweb" className="text-sm font-medium">Live Web Search</Label>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                {/* Enable Fact-checking */}
                <div className="flex items-center space-x-3">
                  <Switch
                    id="factcheck"
                    checked={enableFactCheck}
                    onCheckedChange={setEnableFactCheck}
                    data-testid="switch-factcheck"
                  />
                  <Label htmlFor="factcheck" className="text-sm font-medium">Enable Fact-checking</Label>
                </div>

                {/* Real-time Streaming */}
                <div className="flex items-center space-x-3">
                  <Switch
                    id="streaming"
                    checked={useStreaming}
                    onCheckedChange={(checked) => {
                      console.log("GuidedPage: Setting useStreaming to", checked);
                      setUseStreaming(checked);
                    }}
                    data-testid="switch-streaming"
                  />
                  <Label htmlFor="streaming" className="text-sm font-medium">Real-time Streaming</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Collaborative Thinking Button - After Toggles */}
        <div className="mb-6">
          <Button 
            onClick={handleSubmit}
            disabled={thinkMutation.isPending || isStreaming}
            className="w-full flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-start-thinking"
          >
            {(thinkMutation.isPending || isStreaming) ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                {isStreaming ? "Thinking..." : "Processing..."}
              </>
            ) : (
              <>
                <Rocket size={16} />
                Start Collaborative Thinking
              </>
            )}
          </Button>
        </div>

        {/* Start Live Stream Button - Only when streaming is enabled */}
        {useStreaming && (
          <div className="mb-6">
            <Button 
              onClick={handleStreamingSubmit}
              disabled={isStreaming || thinkMutation.isPending}
              className="w-full flex items-center justify-center gap-2 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-start-live-stream"
            >
              {isStreaming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Streaming...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Start Live Stream
                </>
              )}
            </Button>
          </div>
        )}

        {/* Live Streaming Section (when streaming and active) */}
        {useStreaming && isStreaming && (
          <div className="mb-6">
            <LiveStreamingSection
              onStartStream={handleStreamingSubmit}
              isStreaming={isStreaming}
              streamingResult={streamingResult}
            />
          </div>
        )}

        {/* Results Window - Always Visible */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ResultsSection
              consensus={results?.consensus}
              dissents={results?.dissents}
              unresolved={results?.unresolved}
              citations={results?.citations}
              isVisible={true} // Always show results window
              onQuestionClick={handleQuestionClick}
              onCustomQuestion={handleQuestionClick} // Reuse same logic for custom questions
              isProcessingQuestion={isProcessingQuestion}
              currentQuestion={currentQuestion}
            />
          </div>

          {/* Performance Telemetry */}
          <div className="lg:col-span-1">
            <TelemetryPanel 
              telemetry={results?.telemetry}
              isProcessing={thinkMutation.isPending || isStreaming}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}