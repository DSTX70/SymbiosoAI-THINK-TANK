import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, Edit, Settings, Wifi, WifiOff, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Participant {
  id: string;
  sessionCode: string;
  userId: string;
  joinedAt: Date;
  role: "viewer" | "participant" | "moderator";
  lastActive?: Date;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
}

interface WorkspaceSyncProps {
  sessionCode: string;
  isOwner?: boolean;
  className?: string;
}

interface LiveActivity {
  type: "join" | "leave" | "edit" | "debate_start" | "debate_update";
  userId: string;
  userName: string;
  timestamp: Date;
  details?: string;
}

export function WorkspaceSync({ sessionCode, isOwner = false, className = "" }: WorkspaceSyncProps) {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);

  useEffect(() => {
    if (!sessionCode) return;

    // Connect to WebSocket for real-time updates
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      // Join workspace sync channel
      ws.send(JSON.stringify({
        type: "sync_workspace",
        sessionCode,
        userId: user?.id
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.sessionCode !== sessionCode) return;

      switch (data.type) {
        case "participant_update":
          setParticipants(data.participants || []);
          break;
        
        case "participant_joined":
          addActivity({
            type: "join",
            userId: data.user.id,
            userName: data.user.firstName || "Anonymous",
            timestamp: new Date(),
            details: `Joined as ${data.role}`
          });
          break;
        
        case "participant_left":
          addActivity({
            type: "leave", 
            userId: data.user.id,
            userName: data.user.firstName || "Anonymous",
            timestamp: new Date()
          });
          break;
        
        case "workspace_edit":
          addActivity({
            type: "edit",
            userId: data.userId,
            userName: data.userName,
            timestamp: new Date(),
            details: data.action
          });
          break;
        
        case "debate_status":
          addActivity({
            type: data.action === "start" ? "debate_start" : "debate_update",
            userId: data.userId,
            userName: data.userName,
            timestamp: new Date(),
            details: data.details
          });
          break;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    // Load initial participants
    fetch(`/api/sessions/code/${sessionCode}/participants`)
      .then(res => res.json())
      .then(setParticipants)
      .catch(console.error);

    return () => {
      ws.close();
    };
  }, [sessionCode, user?.id]);

  const addActivity = (activity: LiveActivity) => {
    setLiveActivities(prev => [activity, ...prev.slice(0, 9)]); // Keep last 10 activities
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "moderator":
        return <Settings className="h-3 w-3" />;
      case "participant":
        return <Edit className="h-3 w-3" />;
      case "viewer":
        return <Eye className="h-3 w-3" />;
      default:
        return <Eye className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "moderator":
        return "bg-purple-500";
      case "participant":
        return "bg-blue-500";
      case "viewer":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "join":
        return "🟢";
      case "leave":
        return "🔴";
      case "edit":
        return "✏️";
      case "debate_start":
        return "🚀";
      case "debate_update":
        return "📝";
      default:
        return "📌";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Status */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-green-700 dark:text-green-400">
                  Connected to workspace
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-red-700 dark:text-red-400">
                  Reconnecting...
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Participants */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">
            Active Participants ({participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {participants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active participants
            </p>
          ) : (
            <div className="space-y-2">
              {participants.map((participant) => (
                <TooltipProvider key={participant.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.user?.profileImageUrl} />
                            <AvatarFallback className="text-xs">
                              {participant.user?.firstName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getRoleColor(participant.role)}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">
                              {participant.user?.firstName || "Anonymous"}
                              {participant.userId === user?.id && (
                                <span className="text-muted-foreground"> (you)</span>
                              )}
                            </span>
                            {getRoleIcon(participant.role)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Joined {formatDistanceToNow(new Date(participant.joinedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs">
                        <p className="font-medium">{participant.user?.firstName} {participant.user?.lastName}</p>
                        <p className="capitalize">{participant.role}</p>
                        {participant.lastActive && (
                          <p>Last active: {formatDistanceToNow(participant.lastActive, { addSuffix: true })}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      {liveActivities.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {liveActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <span className="mt-0.5">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <span className="font-medium">{activity.userName}</span>
                    <span className="text-muted-foreground"> 
                      {activity.type === "join" && "joined the session"}
                      {activity.type === "leave" && "left the session"}
                      {activity.type === "edit" && "made changes"}
                      {activity.type === "debate_start" && "started a debate"}
                      {activity.type === "debate_update" && "updated the debate"}
                    </span>
                    {activity.details && (
                      <span className="text-muted-foreground"> - {activity.details}</span>
                    )}
                    <div className="text-muted-foreground mt-1">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Legend */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <h4 className="text-sm font-medium mb-3">Participant Roles</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <Settings className="h-3 w-3" />
              <span>Moderator - Full access and session control</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <Edit className="h-3 w-3" />
              <span>Participant - Can edit and contribute</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <Eye className="h-3 w-3" />
              <span>Viewer - Can view and chat only</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}