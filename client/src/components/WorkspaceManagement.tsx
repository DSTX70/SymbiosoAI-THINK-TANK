import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  const [realTimeSync, setRealTimeSync] = useState(true);
  const [teamChat, setTeamChat] = useState(false);
  const [preserveOriginal, setPreserveOriginal] = useState(true);
  const [culturalAdaptation, setCulturalAdaptation] = useState(false);

  const handleCreateWorkspace = () => {
    console.log("Creating new workspace");
    // TODO: Implement workspace creation
  };

  const handleJoinWorkspace = () => {
    console.log("Joining workspace with code:", sessionCode);
    // TODO: Implement workspace joining
  };

  const handleManagePermissions = (workspaceId: string) => {
    console.log("Managing permissions for:", workspaceId);
    // TODO: Implement permission management
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    console.log("Opening settings for:", workspaceId);
    // TODO: Implement workspace settings
  };

  const handleInviteMembers = (workspaceId: string) => {
    console.log("Inviting members to:", workspaceId);
    // TODO: Implement member invitation
  };

  const handleArchiveWorkspace = (workspaceId: string) => {
    console.log("Archiving workspace:", workspaceId);
    // TODO: Implement workspace archiving
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
        <Button onClick={handleCreateWorkspace} data-testid="create-workspace">
          <Plus size={14} className="mr-1" />
          Create Workspace
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
                {sampleWorkspaces.map((workspace) => (
                  <Card key={workspace.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{workspace.name}</CardTitle>
                            {workspace.isOwner && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                OWNER
                              </Badge>
                            )}
                            {workspace.isPrivate ? (
                              <Lock size={14} className="text-muted-foreground" />
                            ) : (
                              <Globe size={14} className="text-muted-foreground" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{workspace.description}</p>
                        </div>
                        <Badge 
                          variant={workspace.status === "active" ? "default" : "secondary"}
                          className={workspace.status === "active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                        >
                          {workspace.status}
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
                ))}
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
                disabled={sessionCode.length !== 6}
                data-testid="join-workspace"
              >
                Join
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