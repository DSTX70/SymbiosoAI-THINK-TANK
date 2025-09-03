import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Compass, Rocket, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TelemetryPanel from "@/components/TelemetryPanel";
import ResultsSection from "@/components/ResultsSection";
import LiveStreamingSection, { createStreamUrl } from "@/components/LiveStreamingSection";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThinkRequest, ThinkResponse } from "@shared/schema";

export default function GuidedPage() {
  const [prompt, setPrompt] = useState("");
  const [requireCitations, setRequireCitations] = useState(false);
  const [enableFactCheck, setEnableFactCheck] = useState(false);
  const [enableLiveWeb, setEnableLiveWeb] = useState(false);
  const [useStreaming, setUseStreaming] = useState(false); // MUST BE DEFAULT OFF
  
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
      toast({ description: "Collaborative analysis completed successfully!" });
    },
    onError: (error: any) => {
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
        selection_mode: "smart",
        response_length: "moderate",
        turns: 3,
        debate_format: "collaborative",
        require_evidence: true,
        require_counterarguments: true,
        require_citations: requireCitations,
        enable_fact_check: enableFactCheck,
        live_web: enableLiveWeb,
        verification: {
          fact_check: enableFactCheck,
          min_sources: 3,
        },
      };

      thinkMutation.mutate(requestData);
    }
  };

  const handleStreamingSubmit = () => {
    const settings = {
      mode: "guided",
      selection_mode: "smart",
      response_length: "moderate",
      turns: "3",
      debate_format: "collaborative",
      require_evidence: true,
      require_counterarguments: true,
      require_citations: requireCitations,
      enable_fact_check: enableFactCheck,
      live_web: enableLiveWeb,
      min_sources: "3",
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
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe your challenge for collaborative AI thinking..."
              className="resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              data-testid="input-collaborative-prompt"
            />
            
            {/* Start Collaborative Thinking Button - Below Input */}
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
          </CardContent>
        </Card>

        {/* Toggle Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 2. Require Citations */}
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Switch
                  id="citations"
                  checked={requireCitations}
                  onCheckedChange={setRequireCitations}
                  data-testid="switch-citations"
                />
                <Label htmlFor="citations" className="text-sm font-medium">Require Citations</Label>
              </div>
            </CardContent>
          </Card>

          {/* 3. Enable Fact-checking */}
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Switch
                  id="factcheck"
                  checked={enableFactCheck}
                  onCheckedChange={setEnableFactCheck}
                  data-testid="switch-factcheck"
                />
                <Label htmlFor="factcheck" className="text-sm font-medium">Enable Fact-checking</Label>
              </div>
            </CardContent>
          </Card>

          {/* 4. Live Web Search */}
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Switch
                  id="liveweb"
                  checked={enableLiveWeb}
                  onCheckedChange={setEnableLiveWeb}
                  data-testid="switch-liveweb"
                />
                <Label htmlFor="liveweb" className="text-sm font-medium">Live Web Search</Label>
              </div>
            </CardContent>
          </Card>

          {/* 5. Real-time Streaming */}
          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Switch
                  id="streaming"
                  checked={useStreaming}
                  onCheckedChange={setUseStreaming}
                  data-testid="switch-streaming"
                />
                <Label htmlFor="streaming" className="text-sm font-medium">Real-time Streaming</Label>
              </div>
            </CardContent>
          </Card>
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