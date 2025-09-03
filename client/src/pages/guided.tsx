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
  const [useStreaming, setUseStreaming] = useState(() => {
    console.log("GuidedPage: Initializing useStreaming to FALSE");
    return false;
  }); // FORCE DEFAULT OFF
  
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

  const handleQuestionClick = async (question: string) => {
    if (!results) return;

    toast({ description: `Exploring question: "${question}"...` });

    // Create a new debate with the clicked question as prompt
    const requestData: ThinkRequest = {
      prompt: question.trim(),
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

    try {
      const response = await apiRequest("POST", "/api/think", requestData);
      const newResults = await response.json() as ThinkResponse;

      // Merge results: combine consensus, add dissents, merge unresolved (removing clicked question)
      const mergedResults: ThinkResponse = {
        consensus: results.consensus + 
          "\n\n" + 
          "═".repeat(50) + 
          "\n🔍 ADDITIONAL ANALYSIS: " + question + 
          "\n" + "═".repeat(50) + 
          "\n\n" + newResults.consensus,
        dissents: [...(results.dissents || []), ...(newResults.dissents || [])],
        unresolved: [
          ...(results.unresolved || []).filter(q => q !== question), // Remove clicked question
          ...(newResults.unresolved || []) // Add new unresolved questions
        ],
        citations: [...(results.citations || []), ...(newResults.citations || [])],
        fact_check: newResults.fact_check || results.fact_check,
        telemetry: newResults.telemetry || results.telemetry
      };

      setResults(mergedResults);
      toast({ description: `Question explored and results merged successfully!` });
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to explore question" 
      });
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