import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lightbulb, Play, Zap, Bot } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TelemetryPanel from "@/components/TelemetryPanel";
import ResultsSection from "@/components/ResultsSection";
import LiveStreamingSection from "@/components/LiveStreamingSection";
import { createStreamUrl } from "@/lib/streamUtils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThinkRequest, ThinkResponse } from "@shared/schema";

export default function SimplePage() {
  const [prompt, setPrompt] = useState("");
  const [requireCitations, setRequireCitations] = useState(false);
  const [enableFactCheck, setEnableFactCheck] = useState(false);
  const [enableLiveWeb, setEnableLiveWeb] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic">("openai");
  const [useStreaming, setUseStreaming] = useState(false); // Default OFF
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
      toast({ description: "Analysis completed successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to process analysis" 
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
        mode: "simple",
        require_citations: requireCitations,
        enable_fact_check: enableFactCheck,
        live_web: enableLiveWeb,
        model_provider: selectedModel,
      };
      thinkMutation.mutate(requestData);
    }
  };

  const handleStreamingSubmit = () => {
    const settings = {
      mode: "simple",
      require_citations: requireCitations,
      enable_fact_check: enableFactCheck,
      live_web: enableLiveWeb,
      turns: "1",
      response_length: "moderate"
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
      toast({ description: "Streaming analysis completed successfully!" });
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
      mode: "simple",
      require_citations: requireCitations,
      enable_fact_check: enableFactCheck,
      live_web: enableLiveWeb,
      model_provider: selectedModel,
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
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* Prompt Card */}
            <Card className="card-elevated gradient-bg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lightbulb className="text-primary" size={20} />
                  Collaborative Prompt
                  <div className={`status-indicator ${thinkMutation.isPending ? "status-processing" : results ? "status-complete" : "status-idle"}`} data-testid="status-simple"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Describe your challenge or question for collaborative AI analysis..."
                  className="resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  data-testid="input-prompt"
                />
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="citations"
                      checked={requireCitations}
                      onCheckedChange={setRequireCitations}
                      data-testid="switch-citations"
                    />
                    <Label htmlFor="citations" className="text-sm">Require Citations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="factcheck"
                      checked={enableFactCheck}
                      onCheckedChange={setEnableFactCheck}
                      data-testid="switch-factcheck"
                    />
                    <Label htmlFor="factcheck" className="text-sm">Enable Fact-checking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="liveweb"
                      checked={enableLiveWeb}
                      onCheckedChange={setEnableLiveWeb}
                      data-testid="switch-liveweb"
                    />
                    <Label htmlFor="liveweb" className="text-sm">Live Web Search</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="streaming"
                      checked={useStreaming}
                      onCheckedChange={setUseStreaming}
                      data-testid="switch-streaming"
                    />
                    <Label htmlFor="streaming" className="text-sm">Real-time Streaming</Label>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  disabled={thinkMutation.isPending || isStreaming}
                  className="btn-primary flex items-center gap-2"
                  data-testid="button-start-thinking"
                >
                  {(thinkMutation.isPending || isStreaming) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      {isStreaming ? "Streaming..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      {useStreaming ? <Zap size={16} /> : <Play size={16} />}
                      {useStreaming ? "Start Live Stream" : "Start Collaborative Thinking"}
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

            {/* Results Section */}
            <ResultsSection
              consensus={results?.consensus}
              dissents={results?.dissents}
              unresolved={results?.unresolved}
              citations={results?.citations}
              isVisible={!!results}
              onQuestionClick={handleQuestionClick}
              onCustomQuestion={handleQuestionClick} // Reuse same logic for custom questions
              isProcessingQuestion={isProcessingQuestion}
              currentQuestion={currentQuestion}
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
      <Footer />
    </div>
  );
}
