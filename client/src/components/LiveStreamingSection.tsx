import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, Download, Zap, AlertTriangle, RotateCw, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";

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

export interface LiveStreamingRef {
  connectToStream: (streamUrl: string) => EventSource | null;
  disconnectStream: () => void;
  getStreamStatus: () => 'connected' | 'disconnected' | 'error' | 'reconnecting';
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
  const [verificationFindings, setVerificationFindings] = useState<Array<{
    claim: string;
    status: "supported" | "contradicted" | "inconclusive";
    note?: string;
    citations?: Array<{title?: string; url?: string; source?: string;}>;
  }>>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error' | 'reconnecting'>('disconnected');
  const [retryCount, setRetryCount] = useState(0);
  const currentEventSource = useRef<EventSource | null>(null);
  const maxRetries = 3;
  const retryDelay = 2000;

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

  const disconnectStream = useCallback(() => {
    if (currentEventSource.current) {
      currentEventSource.current.close();
      currentEventSource.current = null;
      setConnectionStatus('disconnected');
    }
  }, []);

  const connectToStream = useCallback((streamUrl: string): EventSource | null => {
    // Disconnect any existing stream
    disconnectStream();
    
    // Reset streaming state
    setOpenaiStream("");
    setClaudeStream("");
    setClaims([]);
    setProgress(0);
    setCurrentStep("");
    setVerificationFindings([]);
    setRetryCount(0);
    setConnectionStatus('reconnecting');

    try {
      const eventSource = new EventSource(streamUrl);
      currentEventSource.current = eventSource;
      
      eventSource.onopen = () => {
        setConnectionStatus('connected');
        setRetryCount(0);
      };

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
      } else if (data.step === "verification") {
        setVerificationFindings(data.findings || []);
        if (data.error) {
          setCurrentStep(`Verification: ${data.error}`);
        }
      }
    });

    eventSource.addEventListener("final", (event) => {
      const data = JSON.parse(event.data);
      // Final result will be handled by parent component
      eventSource.close();
      setCurrentStep("Analysis complete!");
      setProgress(100);
    });

    eventSource.onerror = (event) => {
      setConnectionStatus('error');
      setCurrentStep("Connection interrupted");
      
      // Auto-retry logic with exponential backoff
      if (retryCount < maxRetries) {
        setConnectionStatus('reconnecting');
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          connectToStream(streamUrl);
        }, retryDelay * Math.pow(2, retryCount));
      } else {
        eventSource.close();
        currentEventSource.current = null;
        setConnectionStatus('error');
        toast({ 
          variant: "destructive",
          description: `Stream connection failed after ${maxRetries} attempts` 
        });
      }
    };

    return eventSource;
    } catch (error) {
      setConnectionStatus('error');
      toast({ 
        variant: "destructive",
        description: "Failed to establish stream connection" 
      });
      return null;
    }
  }, [retryCount, disconnectStream, toast]);

  const getStreamStatus = useCallback(() => connectionStatus, [connectionStatus]);

  // Expose connectToStream for parent components via onStartStream callback
  useEffect(() => {
    if (onStartStream) {
      onStartStream({ connectToStream, disconnectStream, getStreamStatus });
    }
  }, [onStartStream, connectToStream, disconnectStream, getStreamStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectStream();
    };
  }, [disconnectStream]);

  // Connection status indicator helpers
  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="text-green-500" size={16} />;
      case 'reconnecting':
        return <RotateCw className="text-yellow-500 animate-spin" size={16} />;
      case 'error':
        return <WifiOff className="text-red-500" size={16} />;
      default:
        return <Radio className="text-gray-400" size={16} />;
    }
  };
  
  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'reconnecting':
        return `Reconnecting... (${retryCount}/${maxRetries})`;
      case 'error':
        return 'Connection failed';
      default:
        return 'Disconnected';
    }
  };

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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="text-primary" size={20} />
                Streaming Progress
              </div>
              <div className="flex items-center gap-2 text-sm">
                {getStatusIcon()}
                <span className={`font-medium ${
                  connectionStatus === 'connected' ? 'text-green-600' :
                  connectionStatus === 'reconnecting' ? 'text-yellow-600' :
                  connectionStatus === 'error' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {getStatusText()}
                </span>
              </div>
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

            {verificationFindings.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium mb-2">External Verification:</h4>
                <ul className="text-sm space-y-2">
                  {verificationFindings.map((finding, index) => (
                    <li key={index} className={`p-3 rounded border-l-4 ${
                      finding.status === 'supported' ? 'bg-green-50 dark:bg-green-950/20 border-l-green-500' :
                      finding.status === 'contradicted' ? 'bg-red-50 dark:bg-red-950/20 border-l-red-500' :
                      'bg-yellow-50 dark:bg-yellow-950/20 border-l-yellow-500'
                    }`}>
                      <div className="flex items-start gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full mt-2 ${
                          finding.status === 'supported' ? 'bg-green-500' :
                          finding.status === 'contradicted' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="font-medium">{finding.claim}</div>
                          <div className={`text-xs uppercase tracking-wide font-semibold ${
                            finding.status === 'supported' ? 'text-green-700 dark:text-green-400' :
                            finding.status === 'contradicted' ? 'text-red-700 dark:text-red-400' :
                            'text-yellow-700 dark:text-yellow-400'
                          }`}>
                            {finding.status}
                          </div>
                          {finding.note && (
                            <div className="text-muted-foreground mt-1">{finding.note}</div>
                          )}
                        </div>
                      </div>
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