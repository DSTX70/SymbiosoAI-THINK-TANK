import React, { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Save, Play, Lightbulb, Settings } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TelemetryPanel from "@/components/TelemetryPanel";
import { ConfigurationSidebar } from "@/components/ConfigurationSidebar";
import { ResultsArea } from "@/components/ResultsArea";
import ThinkToast from "@/components/ThinkToast";
import { TemplateLibrary } from "@/components/TemplateLibrary";
import { WorkspaceManagement } from "@/components/WorkspaceManagement";
import LiveStreamingSection from "@/components/LiveStreamingSection";
import { createStreamUrl } from "@/lib/streamUtils";
import { LiveChat } from "@/components/LiveChat";
import { SessionSharing } from "@/components/SessionSharing";
import { WorkspaceSync } from "@/components/WorkspaceSync";
import { useCollaboration } from "@/hooks/useCollaboration";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThinkRequest, ThinkResponse } from "@shared/schema";

export default function ExpertPage() {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [debateTitle, setDebateTitle] = useState("");
  const [results, setResults] = useState<ThinkResponse | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [useStreaming, setUseStreaming] = useState(false);
  const [streamingResult, setStreamingResult] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  // Collaboration state
  const [currentSessionCode, setCurrentSessionCode] = useState<string>("");
  const [showLiveChat, setShowLiveChat] = useState(false);
  const { isConnected: isCollaborating, participantCount } = useCollaboration(currentSessionCode);

  // Expert Mode Configuration State
  const [configuration, setConfiguration] = useState({
    frameworks: ["systems_thinking", "first_principles"],
    routing: {
      analyst: 25,
      pragmatist: 30,
      thoughtful: 20,
      innovator: 15,
      critic: 10,
    },
    rag: {
      enabled: false,
      top_k: 5,
      max_tokens: 1000,
      web: true,
      code: false,
    },
    security: {
      pii_redaction: true,
      log_masking: false,
      region: "us-east",
    },
    export_formats: ["pdf", "json"],
    ethical_lens: true,
    evidence_per_claim: 2,
    max_steps: 5,
    // AI Agent Selection
    selection_mode: "smart",
    manual_agents: [],
    domain_experts: [],
    usecase_type: "",
    // Advanced AI Capabilities
    thinking_patterns: [],
    enterprise_specialists: [],
    creativity_level: 50,
    deep_analysis_mode: false,
    // Real-time Streaming
    use_streaming: false,
  });


  const thinkMutation = useMutation({
    mutationFn: async (data: ThinkRequest) => {
      const response = await apiRequest("POST", "/api/think", data);
      return response.json();
    },
    onSuccess: (data: ThinkResponse) => {
      setResults(data);
      setProcessingProgress(100);
      toast({ description: "Expert analysis completed successfully!" });
    },
    onError: (error: any) => {
      setProcessingProgress(0);
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to process expert analysis" 
      });
    },
  });

  // Processing progress simulation
  useEffect(() => {
    if (!thinkMutation.isPending) {
      setProcessingProgress(0);
      return;
    }
    const id = window.setInterval(() => {
      setProcessingProgress(prev => Math.min(prev + Math.random() * 15, 85));
    }, 500);
    return () => window.clearInterval(id);
  }, [thinkMutation.isPending]);

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast({ 
        variant: "destructive",
        description: "Please enter a prompt to analyze" 
      });
      return;
    }

    if (configuration.use_streaming) {
      handleStreamingSubmit();
    } else {
      const requestData: ThinkRequest = {
        prompt: prompt.trim(),
        mode: "expert",
        context: context.trim() || undefined,
        debate_title: debateTitle.trim() || undefined,
        temperature: 0.2,
        
        // AI Agent Selection
        selection_mode: configuration.selection_mode as any,
        manual_agents: configuration.selection_mode === "manual" ? configuration.manual_agents as any : undefined,
        domain_experts: configuration.selection_mode === "domain" ? configuration.domain_experts as any : undefined,
        usecase_type: configuration.selection_mode === "usecase" && configuration.usecase_type !== "" ? configuration.usecase_type as any : undefined,
        
        // Expert Mode Features
        frameworks: configuration.frameworks.length > 0 ? configuration.frameworks as any : undefined,
        thinking_patterns: configuration.thinking_patterns && configuration.thinking_patterns.length > 0 ? configuration.thinking_patterns as any : undefined,
        enterprise_specialists: configuration.enterprise_specialists && configuration.enterprise_specialists.length > 0 ? configuration.enterprise_specialists as any : undefined,
        creativity_level: configuration.creativity_level,
        routing: configuration.routing,
        rag: configuration.rag.enabled ? configuration.rag : undefined,
        security: configuration.security,
        export_formats: configuration.export_formats.length > 0 ? configuration.export_formats as any : undefined,
        ethical_lens: configuration.ethical_lens,
        evidence_per_claim: configuration.evidence_per_claim,
        max_steps: configuration.max_steps,
        
        // Advanced debate settings
        require_citations: true,
        enable_fact_check: true,
        turns: 1, // Keep performance optimization
        debate_format: "collaborative",
        response_length: "detailed",
      };

      thinkMutation.mutate(requestData);
    }
  };

  const handleStreamingSubmit = () => {
    const settings = {
      mode: "expert",
      context: context.trim() || undefined,
      debate_title: debateTitle.trim() || undefined,
      require_citations: true,
      enable_fact_check: true,
      turns: "1",
      response_length: "detailed",
      selection_mode: configuration.selection_mode,
      manual_agents: configuration.selection_mode === "manual" ? configuration.manual_agents : undefined,
      domain_experts: configuration.selection_mode === "domain" ? configuration.domain_experts : undefined,
      usecase_type: configuration.selection_mode === "usecase" && configuration.usecase_type !== "" ? configuration.usecase_type : undefined,
      frameworks: configuration.frameworks.length > 0 ? configuration.frameworks : undefined,
      thinking_patterns: configuration.thinking_patterns && configuration.thinking_patterns.length > 0 ? configuration.thinking_patterns : undefined,
      enterprise_specialists: configuration.enterprise_specialists && configuration.enterprise_specialists.length > 0 ? configuration.enterprise_specialists : undefined,
      creativity_level: configuration.creativity_level,
      routing: configuration.routing,
      rag: configuration.rag.enabled ? configuration.rag : undefined,
      security: configuration.security,
      export_formats: configuration.export_formats.length > 0 ? configuration.export_formats : undefined,
      ethical_lens: configuration.ethical_lens,
      evidence_per_claim: configuration.evidence_per_claim,
      max_steps: configuration.max_steps,
      deep_analysis_mode: configuration.deep_analysis_mode,
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
      toast({ description: "Expert streaming analysis completed successfully!" });
    });

    eventSource.addEventListener("error", () => {
      setIsStreaming(false);
      eventSource.close();
      toast({ 
        variant: "destructive",
        description: "Streaming connection failed" 
      });
    });
  };

  const handleSaveDraft = () => {
    // Save current configuration and prompt to localStorage
    const draft = {
      prompt,
      context,
      debateTitle,
      configuration,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('expert_mode_draft', JSON.stringify(draft));
    toast({ description: "Draft saved successfully!" });
  };

  const handleLoadDraft = () => {
    const saved = localStorage.getItem('expert_mode_draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setPrompt(draft.prompt || "");
        setContext(draft.context || "");
        setDebateTitle(draft.debateTitle || "");
        setConfiguration(draft.configuration || configuration);
        toast({ description: "Draft loaded successfully!" });
      } catch (error) {
        toast({ 
          variant: "destructive",
          description: "Failed to load draft" 
        });
      }
    } else {
      toast({ 
        variant: "destructive",
        description: "No saved draft found" 
      });
    }
  };


  const cancel = () => {
    // Note: This would need actual cancellation logic in a real implementation
    setProcessingProgress(0);
    toast({ description: "Analysis cancelled" });
  };

  const currentSession = useMemo(
    () => ({
      mode: "Expert Reasoning",
      models: 5,
      startTime: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }),
    []
  );

  const handleExport = (format: string) => {
    if (!results) return;
    
    const filename = `expert-analysis-${Date.now()}.${format}`;
    const content = format === 'json' 
      ? JSON.stringify(results, null, 2)
      : results.consensus; // Simplified for demo
    
    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/plain' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ description: `Exported as ${format.toUpperCase()}` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Toast (non-blocking) */}
      <ThinkToast isProcessing={thinkMutation.isPending} processingProgress={processingProgress} onCancel={cancel} />

      {/* Main: Responsive GRID — sidebars when space allows */}
      <main
        className="
          min-h-0 flex-1 grid
          grid-cols-[minmax(0,1fr)]                 /* < lg: center only */
          lg:grid-cols-[16rem_minmax(0,1fr)]        /* lg..xl: left + center */
          xl:grid-cols-[16rem_minmax(0,1fr)_18rem]  /* xl+: left + center + right */
        "
      >
        {/* Left sidebar (256px) */}
        <aside className="hidden lg:block border-r border-border overflow-y-auto">
          <div className="w-64 p-4 space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="text-primary" size={20} />
                  Expert Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveDraft}
                    data-testid="button-save-draft"
                    className="flex-1"
                  >
                    <Save size={14} className="mr-1" />
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLoadDraft}
                    data-testid="button-load-draft"
                    className="flex-1"
                  >
                    Load
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <ConfigurationSidebar
              configuration={configuration}
              onConfigurationChange={setConfiguration}
            />
          </div>
        </aside>

        {/* Center (fills remaining width) */}
        <section className="min-w-0 overflow-y-auto px-4 md:px-6 py-6">
          <Tabs defaultValue="analysis" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis" data-testid="tab-analysis">Expert Analysis</TabsTrigger>
              <TabsTrigger value="templates" data-testid="tab-templates">Template Library</TabsTrigger>
              <TabsTrigger value="workspace" data-testid="tab-workspace">Workspace</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              {/* Prompt Input */}
              <Card className="card-elevated gradient-bg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Brain className="text-primary" size={20} />
                    Expert Analysis Request
                    <div className={`status-indicator ${thinkMutation.isPending ? "status-processing" : results ? "status-complete" : "status-idle"}`} data-testid="status-expert"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="debate-title">Analysis Title (Optional)</Label>
                    <Input
                      id="debate-title"
                      value={debateTitle}
                      onChange={(e) => setDebateTitle(e.target.value)}
                      placeholder="Brief title for this analysis session..."
                      data-testid="input-debate-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt">Primary Question or Challenge</Label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                      placeholder="Describe your complex challenge or question for expert AI analysis..."
                      className="resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      data-testid="input-prompt"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="context">Additional Context (Optional)</Label>
                    <Textarea
                      id="context"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      rows={3}
                      placeholder="Provide any relevant background, constraints, or specific requirements..."
                      className="resize-none"
                      data-testid="input-context"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmit}
                    disabled={thinkMutation.isPending}
                    className="btn-primary flex items-center gap-2 w-full"
                    data-testid="button-start-expert-analysis"
                  >
                    {thinkMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Processing Expert Analysis...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Start Expert Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Live Streaming Section */}
              {configuration.use_streaming && (
                <LiveStreamingSection
                  onStartStream={(streamControls) => {
                    setUseStreaming(true);
                  }}
                  isStreaming={isStreaming}
                  streamingResult={streamingResult}
                />
              )}

              {/* Results */}
              <ResultsArea
                results={results}
                isProcessing={thinkMutation.isPending || isStreaming}
                onExport={handleExport}
              />
              
              {/* Session Management */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Settings className="text-primary" size={20} />
                    Session Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WorkspaceManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <TemplateLibrary />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workspace" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card className="card-elevated">
                    <CardContent className="p-6">
                      <WorkspaceManagement />
                    </CardContent>
                  </Card>

                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Team Collaboration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SessionSharing 
                        currentSessionCode={currentSessionCode}
                        onSessionJoined={setCurrentSessionCode}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <WorkspaceSync 
                    sessionCode={currentSessionCode}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Right sidebar (288px) */}
        <aside className="hidden xl:block border-l border-border overflow-y-auto">
          <div className="w-72 p-4">
            <TelemetryPanel 
              telemetry={results?.telemetry}
              isProcessing={thinkMutation.isPending}
            />
          </div>
        </aside>
      </main>
      
      {/* Live Chat Component */}
      {currentSessionCode && (
        <LiveChat
          sessionCode={currentSessionCode}
          isVisible={showLiveChat}
          onToggle={() => setShowLiveChat(!showLiveChat)}
          participantCount={participantCount}
        />
      )}
      
      <Footer />
    </div>
  );
}