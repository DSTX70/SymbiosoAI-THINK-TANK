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
  TestTube,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Cloud,
  Globe,
  Key,
  Shield,
  Zap,
  FileText,
  BarChart,
  Mail
} from "lucide-react";

interface APIIntegration {
  id: string;
  name: string;
  provider: string;
  type: "database" | "api" | "storage" | "analytics" | "crm" | "messaging" | "custom";
  status: "active" | "inactive" | "error" | "testing";
  description: string;
  endpoint: string;
  authMethod: "api_key" | "oauth2" | "bearer_token" | "basic_auth" | "custom";
  configuration: Record<string, any>;
  lastSync: Date | null;
  errorCount: number;
  successRate: number;
  dataVolume: string;
  rateLimits: {
    requestsPerMinute: number;
    dailyLimit: number;
  };
}

interface APIIntegrationPanelProps {
  integrations?: APIIntegration[];
  onIntegrationCreate?: (integration: Omit<APIIntegration, "id" | "lastSync" | "errorCount" | "successRate">) => void;
  onIntegrationUpdate?: (id: string, integration: Partial<APIIntegration>) => void;
  onIntegrationDelete?: (id: string) => void;
  onIntegrationTest?: (id: string) => Promise<boolean>;
}

const integrationTypes = [
  { value: "database", label: "Database", icon: Database, description: "SQL/NoSQL databases" },
  { value: "api", label: "REST API", icon: Globe, description: "External REST APIs" },
  { value: "storage", label: "Cloud Storage", icon: Cloud, description: "File storage services" },
  { value: "analytics", label: "Analytics", icon: BarChart, description: "Analytics platforms" },
  { value: "crm", label: "CRM", icon: FileText, description: "Customer relationship management" },
  { value: "messaging", label: "Messaging", icon: Mail, description: "Email/SMS services" },
  { value: "custom", label: "Custom", icon: Settings, description: "Custom integrations" }
];

const authMethods = [
  { value: "api_key", label: "API Key", description: "Simple API key authentication" },
  { value: "oauth2", label: "OAuth 2.0", description: "OAuth 2.0 flow authentication" },
  { value: "bearer_token", label: "Bearer Token", description: "JWT or bearer token" },
  { value: "basic_auth", label: "Basic Auth", description: "Username/password authentication" },
  { value: "custom", label: "Custom", description: "Custom authentication method" }
];

const sampleIntegrations: APIIntegration[] = [
  {
    id: "salesforce-crm",
    name: "Salesforce CRM",
    provider: "Salesforce",
    type: "crm",
    status: "active",
    description: "Connect to Salesforce for customer data and lead management",
    endpoint: "https://api.salesforce.com/services/data/v57.0",
    authMethod: "oauth2",
    configuration: {
      clientId: "3MVG9...",
      scopes: ["full", "refresh_token"],
      sandbox: false
    },
    lastSync: new Date(Date.now() - 300000),
    errorCount: 2,
    successRate: 98.5,
    dataVolume: "2.3GB",
    rateLimits: {
      requestsPerMinute: 100,
      dailyLimit: 15000
    }
  },
  {
    id: "postgres-db",
    name: "Analytics Database",
    provider: "PostgreSQL",
    type: "database",
    status: "active",
    description: "Main analytics database for reporting and insights",
    endpoint: "postgres://analytics.company.com:5432/analytics",
    authMethod: "basic_auth",
    configuration: {
      database: "analytics",
      ssl: true,
      poolSize: 10
    },
    lastSync: new Date(Date.now() - 60000),
    errorCount: 0,
    successRate: 99.9,
    dataVolume: "15.7GB",
    rateLimits: {
      requestsPerMinute: 1000,
      dailyLimit: 50000
    }
  },
  {
    id: "stripe-api",
    name: "Stripe Payments",
    provider: "Stripe",
    type: "api",
    status: "testing",
    description: "Payment processing and subscription management",
    endpoint: "https://api.stripe.com/v1",
    authMethod: "bearer_token",
    configuration: {
      version: "2023-10-16",
      webhookUrl: "https://app.company.com/webhooks/stripe"
    },
    lastSync: null,
    errorCount: 0,
    successRate: 0,
    dataVolume: "0MB",
    rateLimits: {
      requestsPerMinute: 100,
      dailyLimit: 10000
    }
  }
];

export function APIIntegrationPanel({
  integrations = sampleIntegrations,
  onIntegrationCreate,
  onIntegrationUpdate,
  onIntegrationDelete,
  onIntegrationTest
}: APIIntegrationPanelProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<APIIntegration | null>(null);
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);
  const [newIntegration, setNewIntegration] = useState<Partial<APIIntegration>>({
    name: "",
    provider: "",
    type: "api",
    status: "inactive",
    description: "",
    endpoint: "",
    authMethod: "api_key",
    configuration: {},
    dataVolume: "0MB",
    rateLimits: {
      requestsPerMinute: 100,
      dailyLimit: 1000
    }
  });

  const handleCreateIntegration = () => {
    if (newIntegration.name && newIntegration.endpoint) {
      onIntegrationCreate?.({
        name: newIntegration.name!,
        provider: newIntegration.provider!,
        type: newIntegration.type!,
        status: "inactive",
        description: newIntegration.description!,
        endpoint: newIntegration.endpoint!,
        authMethod: newIntegration.authMethod!,
        configuration: newIntegration.configuration!,
        dataVolume: newIntegration.dataVolume!,
        rateLimits: newIntegration.rateLimits!
      });
      setNewIntegration({
        name: "",
        provider: "",
        type: "api",
        status: "inactive",
        description: "",
        endpoint: "",
        authMethod: "api_key",
        configuration: {},
        dataVolume: "0MB",
        rateLimits: {
          requestsPerMinute: 100,
          dailyLimit: 1000
        }
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleTestIntegration = async (integrationId: string) => {
    setTestingIntegration(integrationId);
    try {
      const result = await onIntegrationTest?.(integrationId);
      if (result) {
        onIntegrationUpdate?.(integrationId, { status: "active" });
      } else {
        onIntegrationUpdate?.(integrationId, { status: "error" });
      }
    } catch (error) {
      onIntegrationUpdate?.(integrationId, { status: "error" });
    }
    setTestingIntegration(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 bg-green-100";
      case "inactive": return "text-gray-600 bg-gray-100";
      case "error": return "text-red-600 bg-red-100";
      case "testing": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "error": return <AlertCircle className="h-4 w-4" />;
      case "testing": return <TestTube className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeInfo = (type: string) => {
    return integrationTypes.find(t => t.value === type) || integrationTypes[integrationTypes.length - 1];
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="text-primary" size={20} />
            API Integration Panel
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {integrations.filter(i => i.status === 'active').length} active
            </Badge>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="create-integration-button">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Integration
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New API Integration</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="integration-name">Integration Name</Label>
                      <Input
                        id="integration-name"
                        value={newIntegration.name || ""}
                        onChange={(e) => setNewIntegration(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Customer Database"
                        data-testid="integration-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="integration-provider">Provider</Label>
                      <Input
                        id="integration-provider"
                        value={newIntegration.provider || ""}
                        onChange={(e) => setNewIntegration(prev => ({ ...prev, provider: e.target.value }))}
                        placeholder="e.g., Salesforce, MongoDB"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="integration-type">Integration Type</Label>
                    <Select
                      value={newIntegration.type}
                      onValueChange={(value) => setNewIntegration(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger data-testid="integration-type-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {integrationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              <div>
                                <div>{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="integration-description">Description</Label>
                    <Textarea
                      id="integration-description"
                      value={newIntegration.description || ""}
                      onChange={(e) => setNewIntegration(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this integration is used for..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="integration-endpoint">Endpoint URL</Label>
                    <Input
                      id="integration-endpoint"
                      value={newIntegration.endpoint || ""}
                      onChange={(e) => setNewIntegration(prev => ({ ...prev, endpoint: e.target.value }))}
                      placeholder="https://api.example.com/v1"
                      type="url"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="integration-auth">Authentication Method</Label>
                    <Select
                      value={newIntegration.authMethod}
                      onValueChange={(value) => setNewIntegration(prev => ({ ...prev, authMethod: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {authMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            <div>
                              <div>{method.label}</div>
                              <div className="text-xs text-muted-foreground">{method.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleCreateIntegration} disabled={!newIntegration.name || !newIntegration.endpoint}>
                      Create Integration
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {integrations.filter(i => i.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {integrations.filter(i => i.status === 'error').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Database className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {integrations.reduce((acc, i) => acc + parseFloat(i.dataVolume), 0).toFixed(1)}GB
                  </div>
                  <div className="text-sm text-muted-foreground">Data Volume</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {Math.round(integrations.reduce((acc, i) => acc + i.successRate, 0) / integrations.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Success Rate</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {integrations
                    .filter(i => i.lastSync)
                    .sort((a, b) => (b.lastSync?.getTime() || 0) - (a.lastSync?.getTime() || 0))
                    .slice(0, 5)
                    .map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(integration.status)}
                          <div>
                            <div className="font-medium">{integration.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Last sync: {integration.lastSync?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(integration.status)} border-0`}>
                          {integration.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <div className="grid gap-4">
              {integrations.map((integration) => {
                const typeInfo = getTypeInfo(integration.type);
                const TypeIcon = typeInfo.icon;

                return (
                  <Card key={integration.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <TypeIcon className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold">{integration.name}</h3>
                              <Badge className={`text-xs ${getStatusColor(integration.status)} border-0`}>
                                {getStatusIcon(integration.status)}
                                {integration.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Provider:</span> {integration.provider} • 
                              <span className="font-medium"> Type:</span> {typeInfo.label}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Success Rate</div>
                              <div className="text-muted-foreground">{integration.successRate}%</div>
                            </div>
                            <div>
                              <div className="font-medium">Data Volume</div>
                              <div className="text-muted-foreground">{integration.dataVolume}</div>
                            </div>
                            <div>
                              <div className="font-medium">Rate Limit</div>
                              <div className="text-muted-foreground">{integration.rateLimits.requestsPerMinute}/min</div>
                            </div>
                            <div>
                              <div className="font-medium">Errors</div>
                              <div className="text-muted-foreground">{integration.errorCount}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestIntegration(integration.id)}
                          disabled={testingIntegration === integration.id}
                          data-testid={`test-integration-${integration.id}`}
                        >
                          {testingIntegration === integration.id ? (
                            <Clock className="h-4 w-4 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4" />
                          )}
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingIntegration(integration)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onIntegrationDelete?.(integration.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Security Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SSL/TLS Encryption</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Key Rotation</span>
                    <Badge variant="outline" className="text-xs">30 days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limiting</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Access Logging</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Authentication Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {authMethods.map((method) => {
                    const count = integrations.filter(i => i.authMethod === method.value).length;
                    return (
                      <div key={method.value} className="flex items-center justify-between">
                        <span className="text-sm">{method.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {count} integration{count !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{integration.name}</span>
                        <span>{integration.successRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 ${
                            integration.successRate >= 95 ? 'bg-green-500' :
                            integration.successRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${integration.successRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}