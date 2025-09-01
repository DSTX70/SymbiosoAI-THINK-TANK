import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Activity } from "lucide-react";

interface TelemetryData {
  avg_ms: number;
  quality: number;
  tps: number;
  active_agents?: number;
}

interface TelemetryPanelProps {
  telemetry?: TelemetryData;
  isProcessing?: boolean;
}

export default function TelemetryPanel({ telemetry, isProcessing }: TelemetryPanelProps) {
  const defaultTelemetry = {
    avg_ms: 0,
    quality: 0,
    tps: 0,
    active_agents: 3,
  };

  const data = telemetry || defaultTelemetry;

  return (
    <div className="space-y-6">
      <Card className="card-elevated telemetry-widget" data-testid="card-telemetry">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="text-primary" size={20} />
            Performance Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="metric-value" data-testid="text-avg-response">
              {isProcessing ? "..." : `${data.avg_ms}ms`}
            </div>
            <div className="text-xs text-muted-foreground">Average Response Time</div>
          </div>
          <div className="text-center">
            <div className="metric-value" data-testid="text-quality-score">
              {isProcessing ? "..." : data.quality.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Quality Score</div>
          </div>
          <div className="text-center">
            <div className="metric-value" data-testid="text-tokens-per-sec">
              {isProcessing ? "..." : data.tps}
            </div>
            <div className="text-xs text-muted-foreground">Tokens/sec</div>
          </div>
          <div className="text-center">
            <div className="metric-value" data-testid="text-active-agents">
              {data.active_agents || 3}
            </div>
            <div className="text-xs text-muted-foreground">Active AI Agents</div>
          </div>
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>API Status:</span>
              <span className="text-secondary font-medium" data-testid="text-api-status">
                {isProcessing ? "Processing..." : "Healthy"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated" data-testid="card-ai-agents">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="text-secondary" size={20} />
            AI Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Analyst</span>
            <div className={`status-indicator ${isProcessing ? "status-processing" : "status-complete"}`} data-testid="status-analyst"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Critic</span>
            <div className={`status-indicator ${isProcessing ? "status-processing" : "status-complete"}`} data-testid="status-critic"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Synthesizer</span>
            <div className={`status-indicator ${isProcessing ? "status-processing" : "status-complete"}`} data-testid="status-synthesizer"></div>
          </div>
          {data.active_agents && data.active_agents > 3 && (
            <div className="flex items-center justify-between">
              <span className="text-sm">Domain Expert</span>
              <div className={`status-indicator ${isProcessing ? "status-processing" : "status-complete"}`} data-testid="status-domain-expert"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
