import { useState, useEffect } from "react";
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
import TutorialHelpButton from "@/components/TutorialHelpButton";
import { InlineActionError } from "@/components/InlineActionError";
import { DocumentUploader } from "@/components/DocumentUploader";
import { createStreamUrl } from "@/lib/streamUtils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getActionableApiError, type ActionableApiError } from "@/lib/authUtils";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingWalkthrough } from "@/components/OnboardingWalkthrough";
import { consumeWizardConfigForMode, mapEvidenceStrength } from "@/lib/firstAnalysisWizard";
import type { ThinkRequest, ThinkResponse } from "@shared/schema";

export default function SimplePage() {
  const [prompt, setPrompt] = useState("");
  const [requireCitations, setRequireCitations] = useState(false);
  const [enableFactCheck, setEnableFactCheck] = useState(false);
  const [enableLiveWeb, setEnableLiveWeb] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"openai" | "anthropic">("openai");
  const [useStreaming, setUseStreaming] = useState(false); // Default OFF
  const [responseLength, setResponseLength] = useState<"brief" | "moderate" | "detailed">("moderate");
  const [wizardContext, setWizardContext] = useState("");
  const [results, setResults] = useState<ThinkResponse | null>(null);
  const [streamingResult, setStreamingResult] = useState<any>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessingQuestion, setIsProcessingQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [attachedDocument, setAttachedDocument] = useState<{fileName: string; fileUrl: string; fileSize: number} | null>(null);
  const [submissionError, setSubmissionError] = useState<ActionableApiError | null>(null);
  const { toast } = useToast();

  // Onboarding setup
  const onboarding = useOnboarding();

  // Trigger onboarding on page load for new users
  useEffect(() => {
    onboarding.triggerOnboarding({ 
      first_visit: true,
      no_sessions: true 
    });
  }, [onboarding.triggerOnboarding]);

  useEffect(() => {
    const wizardConfig = consumeWizardConfigForMode("simple");
    if (!wizardConfig) return;

    setPrompt(wizardConfig.prompt || "");
    setWizardContext(wizardConfig.context || "");
    setResponseLength(wizardConfig.output_format);

    const evidence = mapEvidenceStrength(wizardConfig.evidence_strength);
    setRequireCitations(evidence.require_citations);
    setEnableFactCheck(evidence.enable_fact_check);
    setEnableLiveWeb(evidence.live_web);
  }, []);

  const thinkMutation = useMutation({
    mutationFn: async (data: ThinkRequest) => {
      const response = await apiRequest("POST", "/api/think", data);
      return response.json();
    },
    onSuccess: (data: ThinkResponse) => {
      setSubmissionError(null);
      setResults(data);
      toast({ description: "Analysis completed successfully!" });
      
      // Track feature usage and trigger follow-up onboarding
      onboarding.trackFeatureUsage("sessions");
      onboarding.triggerOnboarding({ completed_debate: true });
    },
    onError: (error: any) => {
      const actionableError = getActionableApiError(error, {
        onLogin: () => {
          window.location.href = "/api/login";
        },
        onUpgrade: () => {
          window.location.href = "/billing";
        },
      });

      if (actionableError) {
        setSubmissionError(actionableError);
        return;
      }
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to process analysis" 
      });
    },
  });

  const handleSubmit = () => {
    setSubmissionError(null);

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
        context: wizardContext.trim() || undefined,
        response_length: responseLength,
        require_citations: requireCitations,
        enable_fact_check: enableFactCheck,
        live_web: enableLiveWeb,
        model_provider: selectedModel,
        attached_document: attachedDocument || undefined,
      };
      thinkMutation.mutate(requestData);
    }
  };

  const handleStreamingSubmit = () => {
    const settings = {
      mode: "simple",
      context: wizardContext.trim() || undefined,
      require_citations: requireCitations,
      enable_fact_check: enableFactCheck,
      live_web: enableLiveWeb,
      turns: "1",
      response_length: responseLength
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
      attached_document: attachedDocument || undefined, // Include document for follow-up questions too
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
            <Card variant="elevated" className="gradient-bg mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="text-primary" size={20} />
                    Collaborative Prompt
                    <div className={`status-indicator ${thinkMutation.isPending ? "status-processing" : results ? "status-complete" : "status-idle"}`} data-testid="status-simple"></div>
                  </div>
                  <TutorialHelpButton 
                    feature="simple-mode"
                    variant="minimal"
                    size="sm"
                    data-testid="tutorial-help-simple"
                  />
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
                
                {/* Document Upload Section */}
                <DocumentUploader
                  onFileUpload={(fileInfo) => {
                    setAttachedDocument(fileInfo);
                    toast({
                      title: "Document attached",
                      description: `${fileInfo.fileName} has been attached to your prompt`,
                    });
                  }}
                  onFileRemove={() => {
                    setAttachedDocument(null);
                    toast({
                      description: "Document attachment removed"
                    });
                  }}
                  disabled={thinkMutation.isPending || isStreaming}
                  className="border-t pt-4"
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

                {submissionError && (
                  <InlineActionError
                    error={submissionError}
                    onDismiss={() => setSubmissionError(null)}
                  />
                )}
                
                <Button 
                  onClick={handleSubmit}
                  disabled={thinkMutation.isPending || isStreaming}
                  variant="primary" className="flex items-center gap-2"
                  data-testid="run-debate"
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

      {/* Onboarding Walkthrough */}
      <OnboardingWalkthrough
        isActive={onboarding.isActive}
        currentFlow={onboarding.currentFlow}
        currentStepIndex={onboarding.currentStepIndex}
        progress={onboarding.progress}
        onNext={onboarding.nextStep}
        onPrevious={onboarding.previousStep}
        onSkip={onboarding.skipFlow}
        onComplete={onboarding.completeFlow}
        onDismiss={onboarding.dismissOnboarding}
      />
    </div>
  );
}
