import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceContext } from "@/components/WorkspaceContextProvider";
import { 
  Plus, 
  Users, 
  Settings, 
  UserPlus, 
  Archive, 
  TrendingUp,
  Activity,
  Star,
  Lock,
  Globe,
  MessageSquare,
  RefreshCw,
  UserCheck
} from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  isOwner: boolean;
  debates: number;
  avgQuality: number;
  status: "active" | "inactive" | "archived";
  lastActivity: string;
}

const sampleWorkspaces: Workspace[] = [
  {
    id: "product-dev",
    name: "Product Development Team",
    description: "Strategic planning and technical discussions for product development",
    members: 12,
    isPrivate: true,
    isOwner: true,
    debates: 45,
    avgQuality: 8.5,
    status: "active",
    lastActivity: "2 hours ago"
  },
  {
    id: "research-team",
    name: "Research & Innovation",
    description: "Cutting-edge research and innovation discussions",
    members: 8,
    isPrivate: false,
    isOwner: false,
    debates: 23,
    avgQuality: 9.1,
    status: "active",
    lastActivity: "1 day ago"
  },
  {
    id: "strategy-board",
    name: "Executive Strategy Board",
    description: "High-level strategic decisions and planning",
    members: 5,
    isPrivate: true,
    isOwner: true,
    debates: 67,
    avgQuality: 8.9,
    status: "active",
    lastActivity: "5 hours ago"
  }
];

export function WorkspaceManagement() {
  const [sessionCode, setSessionCode] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isPrivateWorkspace, setIsPrivateWorkspace] = useState(false);
  const [realTimeSync, setRealTimeSync] = useState(true);
  const [teamChat, setTeamChat] = useState(false);
  const [preserveOriginal, setPreserveOriginal] = useState(true);
  const [culturalAdaptation, setCulturalAdaptation] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceContext();

  // Fetch user's workspaces
  const { data: workspaces = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/workspaces'],
    retry: false
  });

  // Create workspace mutation
  const createWorkspaceMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; isPrivate?: boolean }) => {
      const response = await apiRequest("POST", "/api/workspaces", data);
      return response.json();
    },
    onSuccess: (workspace) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workspaces'] });
      setWorkspaceName("");
      setWorkspaceDescription("");
      setIsPrivateWorkspace(false);
      if (workspace?.id) {
        setActiveWorkspaceId(workspace.id);
      }
      toast({ description: "Workspace created successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to create workspace" 
      });
    },
  });

  // Join workspace mutation
  const joinWorkspaceMutation = useMutation({
    mutationFn: async (sessionCode: string) => {
      const response = await apiRequest("POST", "/api/workspaces/join", { sessionCode });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/workspaces'] });
      setSessionCode("");
      if (data?.workspace?.id) {
        setActiveWorkspaceId(data.workspace.id);
      }
      toast({ description: data.message || "Successfully joined workspace!" });
    },
    onError: (error: any) => {
      toast({ 
        variant: "destructive",
        description: error.message || "Failed to join workspace" 
      });
    },
  });

  const handleCreateWorkspace = () => {
    if (!workspaceName.trim()) {
      toast({ 
        variant: "destructive",
        description: "Workspace name is required" 
      });
      return;
    }
    
    createWorkspaceMutation.mutate({
      name: workspaceName.trim(),
      description: workspaceDescription.trim() || undefined,
      isPrivate: isPrivateWorkspace
    });
  };

  const handleJoinWorkspace = () => {
    if (!sessionCode.trim()) {
      toast({ 
        variant: "destructive",
        description: "Session code is required" 
      });
      return;
    }
    
    joinWorkspaceMutation.mutate(sessionCode.trim().toUpperCase());
  };

  const handleManagePermissions = (workspaceId: string) => {
    // For now, show a message that this feature is coming soon
    toast({ description: "Permission management coming soon!" });
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    // For now, show a message that this feature is coming soon
    toast({ description: "Workspace settings coming soon!" });
  };

  const handleInviteMembers = (workspaceId: string) => {
    // For now, show a message that this feature is coming soon
    toast({ description: "Member invitation coming soon!" });
  };

  const handleArchiveWorkspace = (workspaceId: string) => {
    // For now, show a message that this feature is coming soon
    toast({ description: "Workspace archiving coming soon!" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Workspace Management
          </h3>
          <p className="text-sm text-muted-foreground">Collaborate with your team in real-time</p>
        </div>
        <Button 
          onClick={handleCreateWorkspace} 
          disabled={createWorkspaceMutation.isPending}
          data-testid="create-workspace"
        >
          <Plus size={14} className="mr-1" />
          {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Workspace Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Workspaces */}
          <div className="space-y-4">
            <h4 className="text-md font-medium">Your Workspaces</h4>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Loading workspaces...</p>
                ) : error ? (
                  <p className="text-sm text-destructive text-center py-8">Unable to load workspaces</p>
                ) : (!workspaces || workspaces.length === 0) ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No workspaces yet. Create your first one!</p>
                ) : (
                  (workspaces as any[]).map((workspace: any) => (
                    <Card key={workspace.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{workspace.name}</CardTitle>
                            {activeWorkspaceId === workspace.id && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
                                ACTIVE
                              </Badge>
                            )}
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                              OWNER
                            </Badge>
                            {workspace.isPrivate ? (
                              <Lock size={14} className="text-muted-foreground" />
                            ) : (
                              <Globe size={14} className="text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{workspace.description || "No description"}</p>
                        </div>
                        <Badge 
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          active
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          {workspace.members} members
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity size={14} />
                          {workspace.debates} debates
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} />
                          {workspace.avgQuality} avg quality
                        </div>
                        <div className="text-xs">
                          {workspace.isPrivate ? "Private" : "Public"}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Last activity: {workspace.lastActivity}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={activeWorkspaceId === workspace.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveWorkspaceId(workspace.id)}
                          data-testid={`set-active-${workspace.id}`}
                        >
                          {activeWorkspaceId === workspace.id ? "Selected" : "Set Active"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleWorkspaceSettings(workspace.id)}
                          data-testid={`settings-${workspace.id}`}
                        >
                          <Settings size={14} className="mr-1" />
                          Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleInviteMembers(workspace.id)}
                          data-testid={`invite-${workspace.id}`}
                        >
                          <UserPlus size={14} className="mr-1" />
                          Invite
                        </Button>
                        {workspace.isOwner && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleArchiveWorkspace(workspace.id)}
                            data-testid={`archive-${workspace.id}`}
                          >
                            <Archive size={14} className="mr-1" />
                            Archive
                          </Button>
                        )}
                      </div>
                    </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Workspace Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Workspace Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">135</div>
                  <div className="text-xs text-muted-foreground">Total Debates</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-green-600">8.7</div>
                  <div className="text-xs text-muted-foreground">Avg Quality</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">25</div>
                  <div className="text-xs text-muted-foreground">Team Members</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collaboration Features Sidebar */}
        <div className="space-y-6">
          {/* Create New Workspace */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-green-500" />
                Create New Workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Workspace Name</Label>
                <Input
                  placeholder="Enter workspace name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  data-testid="workspace-name-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description (Optional)</Label>
                <Input
                  placeholder="Describe your workspace"
                  value={workspaceDescription}
                  onChange={(e) => setWorkspaceDescription(e.target.value)}
                  data-testid="workspace-description-input"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="private-workspace"
                  checked={isPrivateWorkspace}
                  onCheckedChange={setIsPrivateWorkspace}
                  data-testid="private-workspace-switch"
                />
                <Label htmlFor="private-workspace" className="text-sm">Private Workspace</Label>
              </div>
              <Button 
                onClick={handleCreateWorkspace}
                className="w-full"
                disabled={createWorkspaceMutation.isPending || !workspaceName.trim()}
                data-testid="create-workspace-form"
              >
                {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
              </Button>
            </CardContent>
          </Card>

          {/* Join Workspace */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-500" />
                Join Workspace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Session Code (Optional)</Label>
                <Input
                  placeholder="Enter 6-digit code to join existing session"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value)}
                  maxLength={6}
                  data-testid="session-code-input"
                />
              </div>
              <Button 
                onClick={handleJoinWorkspace}
                className="w-full"
                disabled={joinWorkspaceMutation.isPending || !sessionCode.trim()}
                data-testid="join-workspace"
              >
                {joinWorkspaceMutation.isPending ? "Joining..." : "Join Workspace"}
              </Button>
            </CardContent>
          </Card>

          {/* Collaborative Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Collaborative Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-500" />
                    Real-time Sync
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Share debate progress with team members in real-time
                  </p>
                </div>
                <Switch
                  checked={realTimeSync}
                  onCheckedChange={setRealTimeSync}
                  data-testid="real-time-sync"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    Team Chat
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable messaging during collaborative sessions
                  </p>
                </div>
                <Switch
                  checked={teamChat}
                  onCheckedChange={setTeamChat}
                  data-testid="team-chat"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Preserve Original</Label>
                  <p className="text-xs text-muted-foreground">
                    Keep original language response alongside translations
                  </p>
                </div>
                <Switch
                  checked={preserveOriginal}
                  onCheckedChange={setPreserveOriginal}
                  data-testid="preserve-original"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Cultural Adaptation</Label>
                  <p className="text-xs text-muted-foreground">
                    Adapt responses for cultural context and conventions
                  </p>
                </div>
                <Switch
                  checked={culturalAdaptation}
                  onCheckedChange={setCulturalAdaptation}
                  data-testid="cultural-adaptation"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <UserCheck className="h-4 w-4 mr-2" />
                Manage Permissions
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Workspace Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
