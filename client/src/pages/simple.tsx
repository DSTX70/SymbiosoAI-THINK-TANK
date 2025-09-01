import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lightbulb, Play } from "lucide-react";
import Header from "@/components/Header";
import TelemetryPanel from "@/components/TelemetryPanel";
import ResultsSection from "@/components/ResultsSection";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ThinkRequest, ThinkResponse } from "@shared/schema";

export default function SimplePage() {
  const [prompt, setPrompt] = useState("");
  const [requireCitations, setRequireCitations] = useState(false);
  const [enableFactCheck, setEnableFactCheck] = useState(false);
  const [results, setResults] = useState<ThinkResponse | null>(null);
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

    const requestData: ThinkRequest = {
      prompt: prompt.trim(),
      mode: "simple",
      require_citations: requireCitations,
      enable_fact_check: enableFactCheck,
      // temperature: 0.7, // Using default temperature
    };

    thinkMutation.mutate(requestData);
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
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  disabled={thinkMutation.isPending}
                  className="btn-primary flex items-center gap-2"
                  data-testid="button-start-thinking"
                >
                  {thinkMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      Start Collaborative Thinking
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

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
