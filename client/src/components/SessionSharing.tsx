import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Share2, Copy, Users, Clock, Check, UserPlus } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface SessionSharingProps {
  currentSessionCode?: string;
  onSessionJoined?: (sessionCode: string) => void;
}

export function SessionSharing({ currentSessionCode, onSessionJoined }: SessionSharingProps) {
  const [joinCode, setJoinCode] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();

  // Generate session code mutation
  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/sessions/generate-code", {
        method: "POST",
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Session Code Generated",
        description: `Session code: ${data.sessionCode}. Valid for 24 hours.`,
      });
      // Invalidate queries to refresh participant list
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to generate session code. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Join session mutation
  const joinSessionMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest(`/api/sessions/join/${code}`, {
        method: "POST",
      });
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Joined Session",
        description: `Successfully joined collaborative session ${data.sessionCode}`,
      });
      onSessionJoined?.(data.sessionCode);
      setJoinCode("");
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Join Failed",
        description: error.message || "Invalid or expired session code",
        variant: "destructive",
      });
    },
  });

  // Get participants for current session
  const { data: participants } = useQuery({
    queryKey: ["/api/sessions", "participants", currentSessionCode],
    enabled: !!currentSessionCode,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      toast({
        title: "Copied!",
        description: "Session code copied to clipboard",
      });
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleJoinSession = () => {
    if (!joinCode.trim()) return;
    joinSessionMutation.mutate(joinCode.trim().toUpperCase());
  };

  return (
    <div className="space-y-4">
      {/* Current Session Info */}
      {currentSessionCode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Collaboration Session
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center gap-2">
              <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                {currentSessionCode}
              </code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(currentSessionCode)}
                data-testid="button-copy-session-code"
              >
                {copySuccess ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            
            {participants && participants.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Active participants ({participants.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant: any) => (
                    <Badge key={participant.id} variant="secondary" className="text-xs">
                      {participant.user?.firstName || "User"}
                      {participant.role === "moderator" && " (Moderator)"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Session Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="h-auto py-3"
              data-testid="button-share-session"
            >
              <div className="flex flex-col items-center gap-1">
                <Share2 className="h-4 w-4" />
                <span className="text-xs">Share Session</span>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Collaboration Session</DialogTitle>
              <DialogDescription>
                Generate a session code to invite team members to collaborate on this analysis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>• Session codes are valid for 24 hours</p>
                <p>• Team members can view and participate in real-time</p>
                <p>• All participants can see live updates and chat</p>
              </div>
              
              <Button 
                onClick={() => generateCodeMutation.mutate()}
                disabled={generateCodeMutation.isPending}
                className="w-full"
                data-testid="button-generate-code"
              >
                {generateCodeMutation.isPending ? "Generating..." : "Generate Session Code"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="h-auto py-3"
              data-testid="button-join-session"
            >
              <div className="flex flex-col items-center gap-1">
                <UserPlus className="h-4 w-4" />
                <span className="text-xs">Join Session</span>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join Collaboration Session</DialogTitle>
              <DialogDescription>
                Enter a session code to join an existing collaborative analysis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Code</label>
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-8 character code"
                  maxLength={8}
                  className="font-mono"
                  data-testid="input-join-code"
                />
              </div>
              
              <Button 
                onClick={handleJoinSession}
                disabled={!joinCode.trim() || joinSessionMutation.isPending}
                className="w-full"
                data-testid="button-confirm-join"
              >
                {joinSessionMutation.isPending ? "Joining..." : "Join Session"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Session Guidelines */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Collaboration Features
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Real-time chat during analysis sessions</li>
            <li>• Live updates when debates progress</li>
            <li>• Synchronized workspace views</li>
            <li>• Role-based permissions (view/edit/moderate)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}