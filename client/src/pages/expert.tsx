import { useState } from "react";
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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThinkRequest, ThinkResponse } from "@shared/schema";

export default function ExpertPage() {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [debateTitle, setDebateTitle] = useState("");
  const [results, setResults] = useState<ThinkResponse | null>(null);
  const { toast } = useToast();

  // Expert Mode Configuration State
  const [configuration, setConfiguration] = useState({
    frameworks: ["systems", "first_principles"],
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
  });

  const thinkMutation = useMutation({
    mutationFn: async (data: ThinkRequest) => {
      const response = await apiRequest("POST", "/api/think", data);
      return response.json();
    },
    onSuccess: (data: ThinkResponse) => {
      setResults(data);
      toast({ description: "Expert analysis completed successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to process expert analysis" 
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

    const requestData: ThinkRequest = {
      prompt: prompt.trim(),
      mode: "expert",
      context: context.trim() || undefined,
      debate_title: debateTitle.trim() || undefined,
      temperature: 0.2,
      
      // Expert Mode Features
      frameworks: configuration.frameworks.length > 0 ? configuration.frameworks as any : undefined,
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
      
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Configuration Sidebar */}
          <aside className="lg:col-span-3">
            <div className="space-y-6">
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

          {/* Main Content */}
          <div className="lg:col-span-6">
            <div className="space-y-6">
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

              {/* Results */}
              <ResultsArea
                results={results}
                isProcessing={thinkMutation.isPending}
                onExport={handleExport}
              />
            </div>
          </div>

          {/* Telemetry Sidebar */}
          <aside className="lg:col-span-3">
            <TelemetryPanel 
              telemetry={results?.telemetry}
              isProcessing={thinkMutation.isPending}
            />
          </aside>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}