import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  MessageSquare, Plus, Calendar, User, Star, 
  GitCommit, AlertCircle, CheckCircle, Info, Bug, Zap 
} from "lucide-react";

interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  content: string;
  type: 'feature' | 'bugfix' | 'improvement' | 'breaking' | 'security';
  author: string;
  published: boolean;
  pinned: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function ChangelogViewer() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<ChangelogEntry | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch changelog entries
  const { data: changelogData, isLoading: changelogLoading } = useQuery({
    queryKey: ['/api/changelog/list'],
    enabled: true
  });

  const entries = changelogData?.data || [];
  const types = changelogData?.meta?.types || [];

  const filteredEntries = entries.filter((entry: ChangelogEntry) => 
    !selectedType || entry.type === selectedType
  );

  // Add changelog entry mutation
  const addEntryMutation = useMutation({
    mutationFn: async (data: Partial<ChangelogEntry>) => {
      return apiRequest('/api/changelog/add', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/changelog/list'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Entry Added",
        description: "Changelog entry has been added successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Add Failed",
        description: error.message || "Failed to add changelog entry.",
        variant: "destructive"
      });
    }
  });

  // Publish entry mutation
  const publishEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      return apiRequest(`/api/changelog/${entryId}/publish`, {
        method: 'PUT'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/changelog/list'] });
      toast({
        title: "Entry Published",
        description: "Changelog entry has been published successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Publish Failed",
        description: error.message || "Failed to publish entry.",
        variant: "destructive"
      });
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Zap className="h-4 w-4 text-green-500" />;
      case 'bugfix': return <Bug className="h-4 w-4 text-red-500" />;
      case 'improvement': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'breaking': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'security': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'feature': return 'default';
      case 'bugfix': return 'destructive';
      case 'breaking': return 'destructive';
      case 'security': return 'default';
      default: return 'secondary';
    }
  };

  if (changelogLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="changelog-viewer">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Changelog & Release Notes</h2>
          <p className="text-muted-foreground">Stay updated with the latest changes and improvements</p>
        </div>
        
        {user && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-entry">
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Changelog Entry</DialogTitle>
              </DialogHeader>
              <AddEntryForm 
                onSubmit={(data) => addEntryMutation.mutate(data)}
                isLoading={addEntryMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedType("")}
          data-testid="button-type-all"
        >
          All Types
        </Button>
        {types.map((type: string) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
            data-testid={`button-type-${type}`}
            className="flex items-center gap-2"
          >
            {getTypeIcon(type)}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline" data-testid="tab-timeline">Timeline</TabsTrigger>
          <TabsTrigger value="versions" data-testid="tab-versions">By Version</TabsTrigger>
          <TabsTrigger value="viewer" data-testid="tab-viewer">Entry Viewer</TabsTrigger>
        </TabsList>

        {/* Timeline View */}
        <TabsContent value="timeline" className="space-y-4">
          {filteredEntries.length === 0 ? (
            <Alert>
              <AlertDescription>
                No changelog entries found for the selected type.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry: ChangelogEntry) => (
                <Card 
                  key={entry.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEntry(entry)}
                  data-testid={`entry-card-${entry.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <GitCommit className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-lg">{entry.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{entry.version}</Badge>
                            <Badge variant={getTypeBadgeVariant(entry.type)}>
                              {getTypeIcon(entry.type)}
                              <span className="ml-1">{entry.type}</span>
                            </Badge>
                            {entry.pinned && (
                              <Badge variant="secondary">
                                <Star className="h-3 w-3 mr-1" />
                                Pinned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge variant={entry.published ? "default" : "secondary"}>
                        {entry.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {entry.content.substring(0, 200)}...
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {entry.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {entry.published 
                            ? new Date(entry.publishedAt).toLocaleDateString()
                            : new Date(entry.createdAt).toLocaleDateString()
                          }
                        </span>
                      </div>
                      
                      {user && !entry.published && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            publishEntryMutation.mutate(entry.id);
                          }}
                          disabled={publishEntryMutation.isPending}
                          data-testid={`button-publish-${entry.id}`}
                        >
                          Publish
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Version View */}
        <TabsContent value="versions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...new Set(filteredEntries.map((entry: ChangelogEntry) => entry.version))]
              .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
              .map((version: string) => {
                const versionEntries = filteredEntries.filter((entry: ChangelogEntry) => entry.version === version);
                return (
                  <Card key={version} data-testid={`version-card-${version}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitCommit className="h-4 w-4" />
                        Version {version}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {versionEntries.map((entry: ChangelogEntry) => (
                          <div key={entry.id} className="flex items-center gap-2 text-sm">
                            {getTypeIcon(entry.type)}
                            <span className="line-clamp-1">{entry.title}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t text-xs text-muted-foreground">
                        {versionEntries.length} change{versionEntries.length !== 1 ? 's' : ''}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        {/* Entry Viewer */}
        <TabsContent value="viewer" className="space-y-4">
          {selectedEntry ? (
            <Card data-testid="entry-viewer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{selectedEntry.title}</CardTitle>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{selectedEntry.version}</Badge>
                      <Badge variant={getTypeBadgeVariant(selectedEntry.type)}>
                        {getTypeIcon(selectedEntry.type)}
                        <span className="ml-1">{selectedEntry.type}</span>
                      </Badge>
                      {selectedEntry.pinned && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge variant={selectedEntry.published ? "default" : "secondary"}>
                    {selectedEntry.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {selectedEntry.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="mt-6 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {selectedEntry.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {selectedEntry.published 
                        ? `Published ${new Date(selectedEntry.publishedAt).toLocaleDateString()}`
                        : `Created ${new Date(selectedEntry.createdAt).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                  
                  {user && !selectedEntry.published && (
                    <Button
                      size="sm"
                      onClick={() => publishEntryMutation.mutate(selectedEntry.id)}
                      disabled={publishEntryMutation.isPending}
                      data-testid={`button-publish-viewer-${selectedEntry.id}`}
                    >
                      Publish Entry
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <MessageSquare className="h-4 w-4" />
              <AlertDescription>
                Select a changelog entry from the Timeline tab to view its content here.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="stat-total-entries">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{filteredEntries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-published">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold">
                  {filteredEntries.filter((entry: ChangelogEntry) => entry.published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-versions">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Versions</p>
                <p className="text-2xl font-bold">
                  {new Set(filteredEntries.map((entry: ChangelogEntry) => entry.version)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card data-testid="stat-pinned">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pinned</p>
                <p className="text-2xl font-bold">
                  {filteredEntries.filter((entry: ChangelogEntry) => entry.pinned).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add entry form component
function AddEntryForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: Partial<ChangelogEntry>) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    version: "",
    title: "",
    content: "",
    type: "feature" as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="version">Version</Label>
        <Input
          id="version"
          value={formData.version}
          onChange={(e) => setFormData({ ...formData, version: e.target.value })}
          placeholder="e.g., 1.2.0"
          required
          data-testid="input-add-version"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief description of the change"
          required
          data-testid="input-add-title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
          <SelectTrigger data-testid="select-add-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="bugfix">Bug Fix</SelectItem>
            <SelectItem value="improvement">Improvement</SelectItem>
            <SelectItem value="breaking">Breaking Change</SelectItem>
            <SelectItem value="security">Security</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Detailed description of the change..."
          rows={6}
          required
          data-testid="input-add-content"
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-submit-add"
        >
          {isLoading ? "Adding..." : "Add Entry"}
        </Button>
      </div>
    </form>
  );
}