import React, { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Save, Play, Lightbulb, Settings, Users, UserCheck, BookOpen, Briefcase, Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TelemetryPanel from "@/components/TelemetryPanel";
import { ConfigurationSidebar } from "@/components/ConfigurationSidebar";
import { ResultsArea } from "@/components/ResultsArea";
import ThinkToast from "@/components/ThinkToast";
import { TemplateLibrary } from "@/components/TemplateLibrary";
import { WorkspaceManagement } from "@/components/WorkspaceManagement";
import LiveStreamingSection from "@/components/LiveStreamingSection";
import TutorialHelpButton from "@/components/TutorialHelpButton";
import { createStreamUrl } from "@/lib/streamUtils";
import { LiveChat } from "@/components/LiveChat";
import { SessionSharing } from "@/components/SessionSharing";
import { WorkspaceSync } from "@/components/WorkspaceSync";
import { VisualJourneyTimeline } from "@/components/VisualJourneyTimeline";
import { AdvancedFactCheckConfig } from "@/components/AdvancedFactCheckConfig";
import { CoverageAnalysis } from "@/components/CoverageAnalysis";
import { DeepAnalysisMode } from "@/components/DeepAnalysisMode";
import { CustomThinkingPatterns } from "@/components/CustomThinkingPatterns";
import { EnterpriseSpecialists } from "@/components/EnterpriseSpecialists";
import { AdvancedRAGControls } from "@/components/AdvancedRAGControls";
import { APIIntegrationPanel } from "@/components/APIIntegrationPanel";
import { WebhookConfiguration } from "@/components/WebhookConfiguration";
import { CustomExportTemplates } from "@/components/CustomExportTemplates";
import { SSOIntegration } from "@/components/SSOIntegration";
import { SessionTransfer } from "@/components/SessionTransfer";
import { useCollaboration } from "@/hooks/useCollaboration";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { ThinkRequest, ThinkResponse, BrainstormResponse } from "@shared/schema";

export default function ExpertPage() {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [debateTitle, setDebateTitle] = useState("");
  const [results, setResults] = useState<ThinkResponse | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [useStreaming, setUseStreaming] = useState(false);
  const [streamingResult, setStreamingResult] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [transferSessionId, setTransferSessionId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [brainstormResults, setBrainstormResults] = useState<BrainstormResponse | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Template usage handler
  const handleUseTemplate = (template: any) => {
    try {
      // Update prompt with template prompt
      setPrompt(template.config.prompt);
      
      // Update agent selection
      setSelectionMode("manual");
      setManualAgents(template.config.agents as any);
      setDomainExperts(template.config.domainExperts as any);
      
      // Update configuration
      setConfiguration(prev => ({
        ...prev,
        frameworks: [template.config.reasoningFramework],
        max_steps: template.config.debateRounds,
        selection_mode: "manual",
        manual_agents: template.config.agents as any,
        domain_experts: template.config.domainExperts as any,
        advanced_fact_check: {
          ...prev.advanced_fact_check,
          verificationDepth: template.config.enableFactCheck ? "comprehensive" : "standard"
        },
        rag_config: {
          ...prev.rag_config,
          webSearch: template.config.enableLiveWeb
        }
      }));

      // Mark this template as selected
      setSelectedTemplateId(template.id);

      // Close the modal
      setIsTemplateModalOpen(false);

      toast({
        title: "Template Applied",
        description: `"${template.title}" template has been applied to your analysis configuration.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply template configuration.",
        variant: "destructive"
      });
    }
  };

  // Clear template handler
  const handleClearTemplate = () => {
    setSelectedTemplateId(null);
    toast({
      title: "Template Cleared",
      description: "Template selection has been cleared. Your current configuration remains unchanged."
    });
  };

  const handlePreviewTemplate = (template: any) => {
    toast({
      title: "Template Preview",
      description: `Preview: ${template.description}\n\nAgents: ${template.config.agents.join(", ")}\nFramework: ${template.config.reasoningFramework}`
    });
  };

  // Agent Selection State (for UI display)
  const [selectionMode, setSelectionMode] = useState<"smart" | "manual" | "domain" | "usecase">("smart");
  const [manualAgents, setManualAgents] = useState<("analyst" | "pragmatist" | "innovator" | "thoughtful" | "critic")[]>([]);
  const [domainExperts, setDomainExperts] = useState<("legal-analyst" | "legal-advocate" | "medical-diagnostician" | "medical-researcher" | "financial-analyst" | "investment-strategist" | "tech-architect" | "devops-engineer" | "educational-psychologist" | "brand-strategist" | "research-scientist" | "systems-engineer" | "behavioral-analyst" | "sustainability-consultant")[]>([]);
  const [usecaseType, setUsecaseType] = useState<"business_analysis" | "technical_debate" | "creative_brainstorm" | "research_synthesis" | "ethical_discussion" | "document_analysis" | "general_inquiry" | "">("");

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
    manual_agents: [] as ("analyst" | "pragmatist" | "innovator" | "thoughtful" | "critic")[],
    domain_experts: [] as ("legal-analyst" | "legal-advocate" | "medical-diagnostician" | "medical-researcher" | "financial-analyst" | "investment-strategist" | "tech-architect" | "devops-engineer" | "educational-psychologist" | "brand-strategist" | "research-scientist" | "systems-engineer" | "behavioral-analyst" | "sustainability-consultant")[],
    usecase_type: "",
    // Advanced AI Capabilities  
    thinking_patterns: [],
    creativity_level: 50,
    deep_analysis_mode: false,
    // Real-time Streaming
    use_streaming: false,
    // Advanced Analytics Configuration
    advanced_fact_check: {
      verificationDepth: "comprehensive" as const,
      minimumSources: 3,
      confidenceThreshold: 75,
      enableRealTimeValidation: true
    },
    // AI Capabilities Enhancement
    deep_analysis_enabled: false,
    deep_analysis_config: {
      processingDepth: 75,
      iterativeRefinement: true,
      evidenceRequirement: "comprehensive" as const,
      crossValidation: true,
      timeAllocation: 180
    },
    custom_thinking_patterns: [] as string[],
    enterprise_specialists: [] as string[],
    rag_enabled: false,
    rag_config: {
      topK: 5,
      similarityThreshold: 0.7,
      hybridSearch: true,
      webSearch: true,
      documentLibraries: true
    },
    // Integration Features
    api_integrations: [] as string[],
    webhook_configs: [] as string[],
    export_templates: [] as string[],
    sso_providers: [] as string[],
  });


  const thinkMutation = useMutation({
    mutationFn: async (data: ThinkRequest) => {
      const response = await apiRequest("POST", "/api/think", data);
      return response.json();
    },
    onSuccess: (data: ThinkResponse & { sessionId?: string }) => {
      setResults(data);
      setProcessingProgress(100);
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      toast({ description: "Expert analysis completed successfully!" });
    },
    onError: (error: any) => {
      setProcessingProgress(0);
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
        transfer_from_session_id: transferSessionId || undefined,
        
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
          grid-cols-[minmax(0,1fr)]                 /* < md: center only */
          md:grid-cols-[16rem_minmax(0,1fr)]        /* md..xl: left + center */
          xl:grid-cols-[16rem_minmax(0,1fr)_18rem]  /* xl+: left + center + right */
        "
      >
        {/* Left sidebar (256px) */}
        <aside className="hidden md:block border-r border-border overflow-y-auto">
          <div className="w-64 p-4 space-y-6">
            <Card variant="elevated">
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
            <TabsList className="grid w-full grid-cols-5 gap-1">
              <TabsTrigger value="analysis" data-testid="tab-analysis">Analysis</TabsTrigger>
              <TabsTrigger value="ai-capabilities" data-testid="tab-ai-capabilities">AI Capabilities</TabsTrigger>
              <TabsTrigger value="integrations" data-testid="tab-integrations">Integrations</TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
              <TabsTrigger value="workspace" data-testid="tab-workspace">Workspace</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-6">
              {/* Agent Selection Section */}
              <Card variant="elevated" className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="text-primary" size={20} />
                      Agent Selection & Configuration
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsTemplateModalOpen(true)}
                        data-testid="open-templates-modal"
                        className="flex items-center gap-2"
                      >
                        <BookOpen size={16} />
                        Templates
                      </Button>
                      <TutorialHelpButton 
                        feature="expert-mode"
                        variant="minimal"
                        size="sm"
                        data-testid="tutorial-help-expert"
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Experts</h3>
                  <Tabs value={selectionMode} onValueChange={(value: string) => {
                    const mode = value as "smart" | "manual" | "domain" | "usecase";
                    setSelectionMode(mode);
                    setConfiguration(prev => ({
                      ...prev,
                      selection_mode: mode,
                      manual_agents: mode === "manual" ? manualAgents : [],
                      domain_experts: mode === "domain" ? domainExperts : [],
                      usecase_type: mode === "usecase" ? usecaseType : ""
                    }));
                  }}>
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
                                  let newAgents: ("analyst" | "pragmatist" | "innovator" | "thoughtful" | "critic")[];
                                  if (checked) {
                                    newAgents = [...manualAgents, agent.id as any];
                                  } else {
                                    newAgents = manualAgents.filter(id => id !== agent.id);
                                  }
                                  setManualAgents(newAgents);
                                  setConfiguration(prev => ({
                                    ...prev,
                                    manual_agents: newAgents
                                  }));
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
                                  let newExperts: ("legal-analyst" | "legal-advocate" | "medical-diagnostician" | "medical-researcher" | "financial-analyst" | "investment-strategist" | "tech-architect" | "devops-engineer" | "educational-psychologist" | "brand-strategist" | "research-scientist" | "systems-engineer" | "behavioral-analyst" | "sustainability-consultant")[];
                                  if (checked) {
                                    newExperts = [...domainExperts, expert.id as any];
                                  } else {
                                    newExperts = domainExperts.filter(id => id !== expert.id);
                                  }
                                  setDomainExperts(newExperts);
                                  setConfiguration(prev => ({
                                    ...prev,
                                    domain_experts: newExperts
                                  }));
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
                              onClick={() => {
                                const newType = usecase.id as any;
                                setUsecaseType(newType);
                                setConfiguration(prev => ({
                                  ...prev,
                                  usecase_type: newType
                                }));
                              }}
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

              {/* Session Transfer Option */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Continue Previous Debate</h3>
                      <p className="text-sm text-muted-foreground">
                        Build upon insights from previous sessions with full Expert mode capabilities
                      </p>
                    </div>
                    <SessionTransfer 
                      currentMode="expert"
                      onTransfer={(sessionId) => {
                        setTransferSessionId(sessionId);
                        toast({ description: "Previous debate loaded! Ready to enhance with Expert mode features." });
                      }}
                      disabled={thinkMutation.isPending || isStreaming}
                    />
                  </div>
                  {transferSessionId && (
                    <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-800">
                        ✓ Previous debate session loaded. Your new analysis will continue the discussion with advanced Expert mode capabilities.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Prompt Input */}
              <Card variant="elevated" className="gradient-bg">
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
                    variant="primary" className="flex items-center gap-2 w-full"
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
                sessionId={sessionId}
                brainstormResults={brainstormResults}
                onBrainstormComplete={(brainstormData) => {
                  setBrainstormResults(brainstormData);
                  toast({
                    title: "Brainstorming Complete!",
                    description: "Your collaborative solutions are ready for review.",
                  });
                }}
              />
              
              {/* Session Management */}
              <Card variant="elevated">
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

            <TabsContent value="ai-capabilities" className="space-y-6">
              <DeepAnalysisMode
                isEnabled={configuration.deep_analysis_enabled}
                config={configuration.deep_analysis_config}
                onToggle={(enabled) => 
                  setConfiguration(prev => ({
                    ...prev,
                    deep_analysis_enabled: enabled
                  }))
                }
                onChange={(deepConfig) => 
                  setConfiguration(prev => ({
                    ...prev,
                    deep_analysis_config: deepConfig
                  }))
                }
              />
              
              <CustomThinkingPatterns
                selectedPatterns={configuration.custom_thinking_patterns}
                onChange={(patterns) => 
                  setConfiguration(prev => ({
                    ...prev,
                    custom_thinking_patterns: patterns
                  }))
                }
              />
              
              <EnterpriseSpecialists
                selectedSpecialists={configuration.enterprise_specialists}
                onChange={(specialists) => 
                  setConfiguration(prev => ({
                    ...prev,
                    enterprise_specialists: specialists
                  }))
                }
              />
              
              <AdvancedRAGControls
                isEnabled={configuration.rag_enabled}
                config={configuration.rag_config}
                onToggle={(enabled) => 
                  setConfiguration(prev => ({
                    ...prev,
                    rag_enabled: enabled
                  }))
                }
                onChange={(ragConfig) => 
                  setConfiguration(prev => ({
                    ...prev,
                    rag_config: ragConfig
                  }))
                }
              />
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <APIIntegrationPanel
                onIntegrationCreate={(integration) => {
                  // Handle API integration creation
                  console.log('Creating API integration:', integration);
                }}
                onIntegrationUpdate={(id, updates) => {
                  // Handle API integration updates
                  console.log('Updating API integration:', id, updates);
                }}
                onIntegrationDelete={(id) => {
                  // Handle API integration deletion
                  console.log('Deleting API integration:', id);
                }}
                onIntegrationTest={async (id) => {
                  // Handle API integration testing
                  console.log('Testing API integration:', id);
                  return true;
                }}
              />
              
              <WebhookConfiguration
                onWebhookCreate={(webhook) => {
                  // Handle webhook creation
                  console.log('Creating webhook:', webhook);
                }}
                onWebhookUpdate={(id, updates) => {
                  // Handle webhook updates
                  console.log('Updating webhook:', id, updates);
                }}
                onWebhookDelete={(id) => {
                  // Handle webhook deletion
                  console.log('Deleting webhook:', id);
                }}
                onWebhookTest={async (id) => {
                  // Handle webhook testing
                  console.log('Testing webhook:', id);
                  return true;
                }}
              />
              
              <CustomExportTemplates
                onTemplateCreate={(template) => {
                  // Handle template creation
                  console.log('Creating export template:', template);
                }}
                onTemplateUpdate={(id, updates) => {
                  // Handle template updates
                  console.log('Updating export template:', id, updates);
                }}
                onTemplateDelete={(id) => {
                  // Handle template deletion
                  console.log('Deleting export template:', id);
                }}
                onTemplateExport={async (templateId, data) => {
                  // Handle template export
                  console.log('Exporting with template:', templateId, data);
                  return 'exported-file-url';
                }}
                onTemplatePreview={(templateId) => {
                  // Handle template preview
                  console.log('Previewing template:', templateId);
                }}
              />
              
              <SSOIntegration
                onProviderCreate={(provider) => {
                  // Handle SSO provider creation
                  console.log('Creating SSO provider:', provider);
                }}
                onProviderUpdate={(id, updates) => {
                  // Handle SSO provider updates
                  console.log('Updating SSO provider:', id, updates);
                }}
                onProviderDelete={(id) => {
                  // Handle SSO provider deletion
                  console.log('Deleting SSO provider:', id);
                }}
                onProviderTest={async (id) => {
                  // Handle SSO provider testing
                  console.log('Testing SSO provider:', id);
                  return true;
                }}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <VisualJourneyTimeline
                isActive={thinkMutation.isPending || isStreaming}
                overallProgress={processingProgress}
              />
              
              <AdvancedFactCheckConfig
                config={configuration.advanced_fact_check}
                onChange={(factCheckConfig) => 
                  setConfiguration(prev => ({
                    ...prev,
                    advanced_fact_check: factCheckConfig
                  }))
                }
              />
              
              {results && (
                <CoverageAnalysis />
              )}
            </TabsContent>


            <TabsContent value="workspace" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card variant="elevated">
                    <CardContent className="p-6">
                      <WorkspaceManagement />
                    </CardContent>
                  </Card>

                  <Card variant="elevated">
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

      {/* Template Library Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen size={20} />
              Template Library
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <TemplateLibrary 
              onUseTemplate={handleUseTemplate}
              onPreviewTemplate={handlePreviewTemplate}
              selectedTemplateId={selectedTemplateId}
              onClearTemplate={handleClearTemplate}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}