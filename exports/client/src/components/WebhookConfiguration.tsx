import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit, 
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Webhook,
  Bell,
  Key,
  Shield,
  Activity,
  FileText,
  Mail,
  MessageSquare,
  Slack,
  Globe
} from "lucide-react";

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: "active" | "inactive" | "error";
  description: string;
  method: "POST" | "PUT" | "PATCH";
  headers: Record<string, string>;
  authMethod: "none" | "bearer_token" | "api_key" | "basic_auth" | "custom";
  authConfig: Record<string, any>;
  retryPolicy: {
    enabled: boolean;
    maxRetries: number;
    backoffMultiplier: number;
  };
  timeout: number;
  filterExpression: string;
  createdAt: Date;
  lastTriggered: Date | null;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
}

interface WebhookConfigurationProps {
  webhooks?: WebhookConfig[];
  onWebhookCreate?: (webhook: Omit<WebhookConfig, "id" | "createdAt" | "lastTriggered" | "successCount" | "errorCount" | "averageResponseTime">) => void;
  onWebhookUpdate?: (id: string, webhook: Partial<WebhookConfig>) => void;
  onWebhookDelete?: (id: string) => void;
  onWebhookTest?: (id: string) => Promise<boolean>;
}

const availableEvents = [
  { value: "analysis.started", label: "Analysis Started", category: "Analysis" },
  { value: "analysis.completed", label: "Analysis Completed", category: "Analysis" },
  { value: "analysis.failed", label: "Analysis Failed", category: "Analysis" },
  { value: "template.used", label: "Template Used", category: "Templates" },
  { value: "workspace.created", label: "Workspace Created", category: "Workspace" },
  { value: "workspace.shared", label: "Workspace Shared", category: "Workspace" },
  { value: "user.login", label: "User Login", category: "Authentication" },
  { value: "user.logout", label: "User Logout", category: "Authentication" },
  { value: "integration.connected", label: "Integration Connected", category: "Integrations" },
  { value: "integration.disconnected", label: "Integration Disconnected", category: "Integrations" },
  { value: "export.generated", label: "Export Generated", category: "Exports" },
  { value: "alert.triggered", label: "Alert Triggered", category: "Alerts" }
];

const webhookTemplates = [
  {
    name: "Slack Notification",
    url: "https://hooks.slack.com/services/...",
    events: ["analysis.completed", "analysis.failed"],
    icon: MessageSquare,
    description: "Send notifications to Slack channel"
  },
  {
    name: "Email Alert",
    url: "https://api.sendgrid.com/v3/mail/send",
    events: ["analysis.failed", "alert.triggered"],
    icon: Mail,
    description: "Send email notifications"
  },
  {
    name: "Custom API",
    url: "https://api.yourapp.com/webhooks",
    events: ["analysis.completed"],
    icon: Globe,
    description: "Send to custom API endpoint"
  }
];

const sampleWebhooks: WebhookConfig[] = [
  {
    id: "slack-notifications",
    name: "Slack Notifications",
    url: "https://hooks.slack.com/services/T123456/B789012/abcdef123456",
    events: ["analysis.completed", "analysis.failed", "alert.triggered"],
    status: "active",
    description: "Send analysis results and alerts to #ai-notifications channel",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "SymbiosoAI/1.0"
    },
    authMethod: "none",
    authConfig: {},
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      backoffMultiplier: 2
    },
    timeout: 30,
    filterExpression: "",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
    successCount: 47,
    errorCount: 2,
    averageResponseTime: 245
  },
  {
    id: "email-alerts",
    name: "Email Alerts",
    url: "https://api.sendgrid.com/v3/mail/send",
    events: ["analysis.failed", "integration.disconnected"],
    status: "active",
    description: "Send critical alerts via email to admin team",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer SG.***"
    },
    authMethod: "bearer_token",
    authConfig: {
      token: "SG.***"
    },
    retryPolicy: {
      enabled: true,
      maxRetries: 5,
      backoffMultiplier: 1.5
    },
    timeout: 15,
    filterExpression: "severity == 'high'",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    lastTriggered: new Date(Date.now() - 6 * 60 * 60 * 1000),
    successCount: 12,
    errorCount: 0,
    averageResponseTime: 890
  },
  {
    id: "analytics-api",
    name: "Analytics API",
    url: "https://analytics.company.com/api/events",
    events: ["analysis.completed", "template.used", "export.generated"],
    status: "inactive",
    description: "Send usage analytics to internal analytics platform",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": "***"
    },
    authMethod: "api_key",
    authConfig: {
      apiKey: "***",
      headerName: "X-API-Key"
    },
    retryPolicy: {
      enabled: false,
      maxRetries: 0,
      backoffMultiplier: 1
    },
    timeout: 10,
    filterExpression: "",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    lastTriggered: null,
    successCount: 0,
    errorCount: 0,
    averageResponseTime: 0
  }
];

export function WebhookConfiguration({
  webhooks = sampleWebhooks,
  onWebhookCreate,
  onWebhookUpdate,
  onWebhookDelete,
  onWebhookTest
}: WebhookConfigurationProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({
    name: "",
    url: "",
    events: [],
    status: "inactive",
    description: "",
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    authMethod: "none",
    authConfig: {},
    retryPolicy: {
      enabled: true,
      maxRetries: 3,
      backoffMultiplier: 2
    },
    timeout: 30,
    filterExpression: ""
  });

  const handleCreateWebhook = () => {
    if (newWebhook.name && newWebhook.url && newWebhook.events?.length) {
      onWebhookCreate?.({
        name: newWebhook.name!,
        url: newWebhook.url!,
        events: newWebhook.events!,
        status: "inactive",
        description: newWebhook.description!,
        method: newWebhook.method!,
        headers: newWebhook.headers!,
        authMethod: newWebhook.authMethod!,
        authConfig: newWebhook.authConfig!,
        retryPolicy: newWebhook.retryPolicy!,
        timeout: newWebhook.timeout!,
        filterExpression: newWebhook.filterExpression!
      });
      setNewWebhook({
        name: "",
        url: "",
        events: [],
        status: "inactive",
        description: "",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        authMethod: "none",
        authConfig: {},
        retryPolicy: {
          enabled: true,
          maxRetries: 3,
          backoffMultiplier: 2
        },
        timeout: 30,
        filterExpression: ""
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    setTestingWebhook(webhookId);
    try {
      const result = await onWebhookTest?.(webhookId);
      if (result) {
        onWebhookUpdate?.(webhookId, { status: "active" });
      } else {
        onWebhookUpdate?.(webhookId, { status: "error" });
      }
    } catch (error) {
      onWebhookUpdate?.(webhookId, { status: "error" });
    }
    setTestingWebhook(null);
  };

  const applyTemplate = (templateName: string) => {
    const template = webhookTemplates.find(t => t.name === templateName);
    if (template) {
      setNewWebhook(prev => ({
        ...prev,
        name: template.name,
        url: template.url,
        events: template.events,
        description: template.description
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "inactive": return "text-gray-600 bg-gray-100";
      case "error": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "error": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatTimeSince = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const eventsByCategory = availableEvents.reduce((acc, event) => {
    if (!acc[event.category]) acc[event.category] = [];
    acc[event.category].push(event);
    return acc;
  }, {} as Record<string, typeof availableEvents>);

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Webhook className="text-primary" size={20} />
            Webhook Configuration
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {webhooks.filter(w => w.status === 'active').length} active
            </Badge>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="create-webhook-button">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Webhook</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Template Selection */}
                  <div className="space-y-3">
                    <Label>Quick Start Templates</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {webhookTemplates.map((template) => {
                        const Icon = template.icon;
                        return (
                          <Button
                            key={template.name}
                            variant="outline"
                            className="p-4 h-auto flex-col gap-2"
                            onClick={() => applyTemplate(template.name)}
                          >
                            <Icon className="h-6 w-6" />
                            <div className="text-center">
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-muted-foreground">{template.description}</div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-name">Webhook Name</Label>
                      <Input
                        id="webhook-name"
                        value={newWebhook.name || ""}
                        onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Slack Notifications"
                        data-testid="webhook-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhook-method">HTTP Method</Label>
                      <Select
                        value={newWebhook.method}
                        onValueChange={(value) => setNewWebhook(prev => ({ ...prev, method: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      value={newWebhook.url || ""}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://hooks.slack.com/services/..."
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="webhook-description">Description</Label>
                    <Textarea
                      id="webhook-description"
                      value={newWebhook.description || ""}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this webhook does..."
                      rows={2}
                    />
                  </div>

                  {/* Event Selection */}
                  <div className="space-y-3">
                    <Label>Events to Subscribe</Label>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {Object.entries(eventsByCategory).map(([category, events]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                            {events.map((event) => (
                              <label key={event.value} className="flex items-center space-x-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={(newWebhook.events || []).includes(event.value)}
                                  onChange={(e) => {
                                    const events = newWebhook.events || [];
                                    if (e.target.checked) {
                                      setNewWebhook(prev => ({ 
                                        ...prev, 
                                        events: [...events, event.value] 
                                      }));
                                    } else {
                                      setNewWebhook(prev => ({ 
                                        ...prev, 
                                        events: events.filter(e => e !== event.value) 
                                      }));
                                    }
                                  }}
                                  className="rounded"
                                />
                                <span>{event.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCreateWebhook} 
                      disabled={!newWebhook.name || !newWebhook.url || !(newWebhook.events?.length)}
                    >
                      Create Webhook
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="webhooks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="webhooks" className="space-y-6">
            <div className="grid gap-4">
              {webhooks.map((webhook) => (
                <Card key={webhook.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{webhook.name}</h3>
                          <Badge className={`text-xs ${getStatusColor(webhook.status)} border-0`}>
                            {getStatusIcon(webhook.status)}
                            {webhook.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{webhook.description}</p>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">URL:</span> {webhook.url}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="secondary" className="text-xs">
                            {availableEvents.find(e => e.value === event)?.label || event}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Success Rate</div>
                          <div className="text-muted-foreground">
                            {webhook.successCount > 0 ? 
                              Math.round((webhook.successCount / (webhook.successCount + webhook.errorCount)) * 100) : 0}%
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Last Triggered</div>
                          <div className="text-muted-foreground">{formatTimeSince(webhook.lastTriggered)}</div>
                        </div>
                        <div>
                          <div className="font-medium">Response Time</div>
                          <div className="text-muted-foreground">{webhook.averageResponseTime}ms</div>
                        </div>
                        <div>
                          <div className="font-medium">Total Calls</div>
                          <div className="text-muted-foreground">{webhook.successCount + webhook.errorCount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook.id)}
                        disabled={testingWebhook === webhook.id}
                        data-testid={`test-webhook-${webhook.id}`}
                      >
                        {testingWebhook === webhook.id ? (
                          <Clock className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Test
                      </Button>
                      <Switch
                        checked={webhook.status === "active"}
                        onCheckedChange={(checked) => 
                          onWebhookUpdate?.(webhook.id, { status: checked ? "active" : "inactive" })
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingWebhook(webhook)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onWebhookDelete?.(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="space-y-4">
              {Object.entries(eventsByCategory).map(([category, events]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-base">{category} Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {events.map((event) => {
                        const subscribedWebhooks = webhooks.filter(w => w.events.includes(event.value));
                        return (
                          <div key={event.value} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium">{event.label}</div>
                              <div className="text-xs text-muted-foreground">{event.value}</div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {subscribedWebhooks.length} webhook{subscribedWebhooks.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webhooks
                    .filter(w => w.lastTriggered)
                    .sort((a, b) => (b.lastTriggered?.getTime() || 0) - (a.lastTriggered?.getTime() || 0))
                    .slice(0, 10)
                    .map((webhook) => (
                      <div key={webhook.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(webhook.status)}
                          <div>
                            <div className="font-medium">{webhook.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Last triggered: {webhook.lastTriggered?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{webhook.averageResponseTime}ms</div>
                          <div className="text-muted-foreground">Response time</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Send className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {webhooks.reduce((acc, w) => acc + w.successCount + w.errorCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Deliveries</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {webhooks.reduce((acc, w) => acc + w.successCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {webhooks.reduce((acc, w) => acc + w.errorCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}