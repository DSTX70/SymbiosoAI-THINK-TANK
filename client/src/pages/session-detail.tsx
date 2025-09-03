import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Download, Share2 } from "lucide-react";
import Header from "@/components/Header";
import { formatDistanceToNow, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import ResultsSection from "@/components/ResultsSection";
import TelemetryPanel from "@/components/TelemetryPanel";
import type { Session } from "@shared/schema";

export default function SessionDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: session, isLoading, error } = useQuery<Session>({
    queryKey: [`/api/sessions/${id}`],
    retry: false,
    enabled: !!id,
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ description: "Session link copied to clipboard" });
  };

  const handleDownload = () => {
    if (!session) return;
    
    const data = {
      session_id: session.id,
      prompt: session.prompt,
      mode: session.mode,
      created_at: session.createdAt,
      settings: session.settings,
      results: session.results,
      telemetry: session.telemetry
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-${session.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ description: "Session data downloaded" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The session you're looking for doesn't exist or has been deleted.
            </p>
            <Link href="/sessions">
              <Button data-testid="button-back-to-sessions">
                Back to Sessions
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const settings = session.settings && typeof session.settings === 'object' ? session.settings as any : {};
  const results = session.results && typeof session.results === 'object' ? session.results as any : {};
  const telemetry = session.telemetry && typeof session.telemetry === 'object' ? session.telemetry as any : {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/sessions">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft size={16} className="mr-2" />
                Back to Sessions
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={session.mode === "simple" ? "secondary" : "default"}>
                  {session.mode}
                </Badge>
                {results.consensus && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    ✓ Completed
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-2" data-testid="text-session-prompt">
                {session.prompt}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {session.createdAt && (
                    <>
                      {format(new Date(session.createdAt), "PPP 'at' p")} 
                      ({formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })})
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              data-testid="button-share"
            >
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              data-testid="button-download"
            >
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Session Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Session Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium text-muted-foreground">Mode</div>
                <div className="capitalize">{session.mode}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Rounds</div>
                <div>{settings.turns || 3}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Response Length</div>
                <div className="capitalize">{settings.response_length || "moderate"}</div>
              </div>
              <div>
                <div className="font-medium text-muted-foreground">Live Web</div>
                <div>{settings.live_web ? "Enabled" : "Disabled"}</div>
              </div>
              {settings.selection_mode && (
                <div>
                  <div className="font-medium text-muted-foreground">Selection Mode</div>
                  <div className="capitalize">{settings.selection_mode.replace('_', ' ')}</div>
                </div>
              )}
              {settings.manual_agents?.length > 0 && (
                <div>
                  <div className="font-medium text-muted-foreground">Agents</div>
                  <div>{settings.manual_agents.length} selected</div>
                </div>
              )}
              {settings.domain_experts?.length > 0 && (
                <div>
                  <div className="font-medium text-muted-foreground">Domain Experts</div>
                  <div>{settings.domain_experts.length} selected</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results.consensus ? (
          <div className="space-y-6">
            <ResultsSection
              consensus={results.consensus}
              dissents={results.dissents}
              unresolved={results.unresolved}
              citations={results.citations}
              isVisible={true}
            />
            
            {telemetry && (
              <TelemetryPanel telemetry={telemetry} />
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Session In Progress</h3>
              <p className="text-muted-foreground">
                This session hasn't completed yet or results are not available.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}