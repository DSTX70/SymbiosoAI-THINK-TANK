import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Search, ArrowLeft, FileText, Filter } from "lucide-react";
import Header from "@/components/Header";
import { formatDistanceToNow } from "date-fns";
import type { Session } from "@shared/schema";

export default function SessionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "simple" | "guided">("all");

  const { data: sessions = [], isLoading } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
    retry: false,
  });

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = modeFilter === "all" || session.mode === modeFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Session History</h1>
              <p className="text-muted-foreground">
                View and access your previous AI debate sessions
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {sessions.length} total sessions
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search sessions by prompt..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={modeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setModeFilter("all")}
                  data-testid="filter-all"
                >
                  <Filter size={16} className="mr-2" />
                  All
                </Button>
                <Button
                  variant={modeFilter === "simple" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setModeFilter("simple")}
                  data-testid="filter-simple"
                >
                  Simple
                </Button>
                <Button
                  variant={modeFilter === "guided" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setModeFilter("guided")}
                  data-testid="filter-guided"
                >
                  Guided
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm || modeFilter !== "all" ? "No matching sessions" : "No sessions yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || modeFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Start your first AI debate session to see it here"
                }
              </p>
              <Link href="/simple">
                <Button data-testid="button-start-session">
                  Start New Session
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const truncatedPrompt = session.prompt.length > 120 
    ? session.prompt.substring(0, 120) + "..." 
    : session.prompt;

  const hasResults = session.results && typeof session.results === 'object' && 'consensus' in session.results;
  const settings = session.settings && typeof session.settings === 'object' ? session.settings as any : {};
  const agentCount = settings.manual_agents?.length || 
                    settings.domain_experts?.length || 
                    3; // default fallback

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-session-${session.id}`}>
      <Link href={`/sessions/${session.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2 mb-2">
                {truncatedPrompt}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {session.createdAt && formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                </div>
                <Badge variant={session.mode === "simple" ? "secondary" : "default"}>
                  {session.mode}
                </Badge>
                {hasResults ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Completed
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>
              {agentCount} agents • {settings.turns || 3} rounds
            </div>
            <div>
              Click to view details
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}