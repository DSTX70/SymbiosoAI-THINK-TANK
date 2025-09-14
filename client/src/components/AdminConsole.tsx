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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Settings, Plus, Edit, Trash2, Save, X, 
  Database, Server, Shield, Users, Globe, Zap 
} from "lucide-react";

interface AdminSetting {
  key: string;
  value: string;
  description: string;
  category: string;
  lastModifiedBy: string;
  updatedAt: string;
}

export default function AdminConsole() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [editingSetting, setEditingSetting] = useState<AdminSetting | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch admin settings
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    enabled: true
  });

  const settings = settingsData?.data || [];
  const categories = settingsData?.meta?.categories || [];

  const filteredSettings = settings.filter((setting: AdminSetting) => 
    !selectedCategory || setting.category === selectedCategory
  );

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest(`/api/admin/settings/${key}`, {
        method: 'PUT',
        body: JSON.stringify({ value })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      setEditingSetting(null);
      toast({
        title: "Setting Updated",
        description: "Admin setting has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update setting.",
        variant: "destructive"
      });
    }
  });

  // Create setting mutation
  const createSettingMutation = useMutation({
    mutationFn: async (data: Partial<AdminSetting>) => {
      return apiRequest('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Setting Created",
        description: "New admin setting has been created successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create setting.",
        variant: "destructive"
      });
    }
  });

  // Delete setting mutation
  const deleteSettingMutation = useMutation({
    mutationFn: async (key: string) => {
      return apiRequest(`/api/admin/settings/${key}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: "Setting Deleted",
        description: "Admin setting has been deleted successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete setting.",
        variant: "destructive"
      });
    }
  });

  const handleUpdateSetting = (setting: AdminSetting, newValue: string) => {
    updateSettingMutation.mutate({ key: setting.key, value: newValue });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'server': return <Server className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'users': return <Users className="h-4 w-4" />;
      case 'api': return <Globe className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  if (settingsLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-console">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Admin Console</h2>
          <p className="text-muted-foreground">Manage system settings and configuration</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-setting">
              <Plus className="h-4 w-4 mr-2" />
              Create Setting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin Setting</DialogTitle>
            </DialogHeader>
            <CreateSettingForm 
              onSubmit={(data) => createSettingMutation.mutate(data)}
              isLoading={createSettingMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("")}
          data-testid="button-category-all"
        >
          All Categories
        </Button>
        {categories.map((category: string) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            data-testid={`button-category-${category.toLowerCase()}`}
            className="flex items-center gap-2"
          >
            {getCategoryIcon(category)}
            {category}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          <TabsTrigger value="overview" data-testid="tab-overview">System Overview</TabsTrigger>
        </TabsList>

        {/* Settings Management */}
        <TabsContent value="settings" className="space-y-4">
          {filteredSettings.length === 0 ? (
            <Alert>
              <AlertDescription>
                No admin settings found for the selected category.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSettings.map((setting: AdminSetting) => (
                <Card key={setting.key} data-testid={`setting-card-${setting.key}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getCategoryIcon(setting.category)}
                          {setting.key}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {setting.description}
                        </p>
                      </div>
                      <Badge variant="outline">{setting.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingSetting?.key === setting.key ? (
                      <EditingForm
                        setting={setting}
                        onSave={(newValue) => handleUpdateSetting(setting, newValue)}
                        onCancel={() => setEditingSetting(null)}
                        isLoading={updateSettingMutation.isPending}
                      />
                    ) : (
                      <div className="space-y-3">
                        <div className="p-3 bg-muted rounded-md">
                          <code className="text-sm">{setting.value}</code>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Modified by: {setting.lastModifiedBy}</span>
                          <span>{new Date(setting.updatedAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSetting(setting)}
                            data-testid={`button-edit-${setting.key}`}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteSettingMutation.mutate(setting.key)}
                            disabled={deleteSettingMutation.isPending}
                            data-testid={`button-delete-${setting.key}`}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* System Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card data-testid="stat-total-settings">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Settings</p>
                    <p className="text-2xl font-bold">{settings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-categories">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card data-testid="stat-recent-changes">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Recent Changes</p>
                    <p className="text-2xl font-bold">
                      {settings.filter((s: AdminSetting) => 
                        new Date(s.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Settings by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map((category: string) => {
                  const categoryCount = settings.filter((s: AdminSetting) => s.category === category).length;
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span>{category}</span>
                      </div>
                      <Badge variant="outline">{categoryCount}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Edit form component
function EditingForm({ 
  setting, 
  onSave, 
  onCancel, 
  isLoading 
}: { 
  setting: AdminSetting; 
  onSave: (value: string) => void; 
  onCancel: () => void; 
  isLoading: boolean;
}) {
  const [value, setValue] = useState(setting.value);

  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter setting value..."
        data-testid={`input-edit-${setting.key}`}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onSave(value)}
          disabled={isLoading}
          data-testid={`button-save-${setting.key}`}
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          data-testid={`button-cancel-${setting.key}`}
        >
          <X className="h-3 w-3 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Create form component
function CreateSettingForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: Partial<AdminSetting>) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    description: "",
    category: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="key">Setting Key</Label>
        <Input
          id="key"
          value={formData.key}
          onChange={(e) => setFormData({ ...formData, key: e.target.value })}
          placeholder="e.g., max_users, api_rate_limit"
          required
          data-testid="input-create-key"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="value">Value</Label>
        <Textarea
          id="value"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          placeholder="Setting value..."
          required
          data-testid="input-create-value"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this setting"
          required
          data-testid="input-create-description"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="e.g., database, security, api"
          required
          data-testid="input-create-category"
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          data-testid="button-submit-create"
        >
          {isLoading ? "Creating..." : "Create Setting"}
        </Button>
      </div>
    </form>
  );
}