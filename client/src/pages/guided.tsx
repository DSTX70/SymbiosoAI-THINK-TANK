import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Compass, Rocket, SlidersHorizontal, Cog } from "lucide-react";
import Header from "@/components/Header";
import TelemetryPanel from "@/components/TelemetryPanel";
import ResultsSection from "@/components/ResultsSection";
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
  const [minSources, setMinSources] = useState(3);
  const [results, setResults] = useState<ThinkResponse | null>(null);
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

    const requestData: ThinkRequest = {
      prompt: prompt.trim(),
      mode: "guided",
      selection_mode: selectionMode as any,
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
      // temperature: 0.7, // Using default temperature
    };

    thinkMutation.mutate(requestData);
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
                  <Label htmlFor="selection-mode" className="text-sm font-medium">Selection Mode</Label>
                  <Select value={selectionMode} onValueChange={setSelectionMode}>
                    <SelectTrigger data-testid="select-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart">Smart Selection</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="domain">Domain Expert</SelectItem>
                      <SelectItem value="usecase">Use Case Driven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                  disabled={thinkMutation.isPending}
                  className="btn-primary flex items-center gap-2"
                  data-testid="button-guided-run"
                >
                  {thinkMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Rocket size={16} />
                      Launch Guided Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

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
