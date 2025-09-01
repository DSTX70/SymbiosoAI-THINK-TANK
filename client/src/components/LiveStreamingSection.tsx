import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, Download, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";

interface StreamingResult {
  consensus: string;
  dissents: Array<{ position: string; reasoning?: string }>;
  unresolved: string[];
  citations?: Array<{
    title?: string;
    url?: string;
    source?: string;
    author?: string;
    year?: string;
  }>;
  fact_check?: {
    findings: Array<{
      claim: string;
      status: "supported" | "contradicted" | "inconclusive";
      note?: string;
      citations?: Array<{title?: string; url?: string; source?: string;}>;
    }>;
  };
  claims?: string[];
  telemetry?: any;
  timestamp?: string;
  session_id?: string;
  settings?: any;
}

interface LiveStreamingSectionProps {
  onStartStream: (config: any) => void;
  isStreaming: boolean;
  streamingResult?: StreamingResult | null;
}

export default function LiveStreamingSection({ 
  onStartStream, 
  isStreaming, 
  streamingResult 
}: LiveStreamingSectionProps) {
  const { toast } = useToast();
  const [openaiStream, setOpenaiStream] = useState("");
  const [claudeStream, setClaudeStream] = useState("");
  const [claims, setClaims] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const openaiRef = useRef<HTMLDivElement>(null);
  const claudeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll streaming content
  useEffect(() => {
    if (openaiRef.current) {
      openaiRef.current.scrollTop = openaiRef.current.scrollHeight;
    }
  }, [openaiStream]);

  useEffect(() => {
    if (claudeRef.current) {
      claudeRef.current.scrollTop = claudeRef.current.scrollHeight;
    }
  }, [claudeStream]);

  const handleSaveJSON = () => {
    if (!streamingResult) {
      toast({ 
        variant: "destructive",
        description: "No results to save yet" 
      });
      return;
    }

    const blob = new Blob([JSON.stringify(streamingResult, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `symbiosoai_result_${streamingResult.session_id || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ description: "Results exported as JSON successfully!" });
  };

  const connectToStream = (streamUrl: string) => {
    // Reset streaming state
    setOpenaiStream("");
    setClaudeStream("");
    setClaims([]);
    setProgress(0);
    setCurrentStep("");

    const eventSource = new EventSource(streamUrl);

    eventSource.addEventListener("ready", (event) => {
      const data = JSON.parse(event.data);
      setCurrentStep(`Starting with ${data.agents} agents, ${data.rounds} rounds`);
    });

    eventSource.addEventListener("progress", (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.pct || 0);
      setCurrentStep(data.step || "Processing...");
    });

    eventSource.addEventListener("provider", (event) => {
      const data = JSON.parse(event.data);
      if (data.status === "starting") {
        setCurrentStep(`${data.agent} (${data.provider}) thinking...`);
      }
    });

    eventSource.addEventListener("delta", (event) => {
      const data = JSON.parse(event.data);
      if (data.provider === "openai") {
        setOpenaiStream(prev => prev + data.text);
      } else if (data.provider === "anthropic") {
        setClaudeStream(prev => prev + data.text);
      }
    });

    eventSource.addEventListener("step", (event) => {
      const data = JSON.parse(event.data);
      if (data.step === "claims") {
        setClaims(data.claims || []);
      }
    });

    eventSource.addEventListener("final", (event) => {
      const data = JSON.parse(event.data);
      // Final result will be handled by parent component
      eventSource.close();
      setCurrentStep("Analysis complete!");
      setProgress(100);
    });

    eventSource.onerror = () => {
      eventSource.close();
      setCurrentStep("Stream connection error");
      toast({ 
        variant: "destructive",
        description: "Stream connection failed" 
      });
    };

    return eventSource;
  };

  // Expose stream connection for parent component
  useEffect(() => {
    if (isStreaming) {
      // This will be handled by parent component calling connectToStream
    }
  }, [isStreaming]);

  return (
    <div className="space-y-6">
      {/* Live Streams */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Radio className="text-green-500" size={20} />
              Live OpenAI Stream
              {isStreaming && openaiStream && (
                <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={openaiRef}
              className="livebox min-h-32 max-h-64 overflow-y-auto font-mono text-sm"
              data-testid="stream-openai"
            >
              {openaiStream || (isStreaming ? "Waiting for OpenAI..." : "—")}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Radio className="text-blue-500" size={20} />
              Live Anthropic Stream
              {isStreaming && claudeStream && (
                <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={claudeRef}
              className="livebox min-h-32 max-h-64 overflow-y-auto font-mono text-sm"
              data-testid="stream-anthropic"
            >
              {claudeStream || (isStreaming ? "Waiting for Anthropic..." : "—")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Claims */}
      {isStreaming && (
        <Card className="card-elevated processing-state">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Zap className="text-primary" size={20} />
              Streaming Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentStep}</span>
                <span className="text-primary font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {claims.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-2">Extracted Claims:</h4>
                <ul className="text-sm space-y-1">
                  {claims.map((claim, index) => (
                    <li key={index} className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                      • {claim}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Export Actions */}
      {streamingResult && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Download className="text-primary" size={20} />
              Export Streaming Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleSaveJSON}
                className="btn-primary flex items-center gap-2"
                data-testid="button-save-json"
              >
                <Download size={16} />
                Save JSON
              </Button>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>Session: {streamingResult.session_id}</span>
                <span>•</span>
                <span>{streamingResult.timestamp && new Date(streamingResult.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to create stream URL with parameters
export function createStreamUrl(prompt: string, settings: any): string {
  const params = new URLSearchParams({
    prompt: prompt.trim(),
    mode: settings.mode || "simple",
    require_citations: settings.require_citations ? "1" : "0",
    enable_fact_check: settings.enable_fact_check ? "1" : "0",
    live_web: settings.live_web ? "1" : "0",
    temperature: "0.2",
    ...settings
  });
  
  return `/api/think/stream?${params.toString()}`;
}