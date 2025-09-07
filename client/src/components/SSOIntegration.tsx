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
  Shield,
  Key,
  Users,
  Building,
  Globe,
  Mail,
  Smartphone,
  Lock,
  UserCheck,
  Activity,
  AlertTriangle
} from "lucide-react";

interface SSOProvider {
  id: string;
  name: string;
  provider: "saml" | "oauth2" | "oidc" | "ldap" | "azure_ad" | "google" | "okta" | "auth0";
  status: "active" | "inactive" | "error" | "testing";
  description: string;
  configuration: {
    // SAML specific
    entityId?: string;
    ssoUrl?: string;
    x509Certificate?: string;
    // OAuth2/OIDC specific
    clientId?: string;
    clientSecret?: string;
    authorizationUrl?: string;
    tokenUrl?: string;
    userInfoUrl?: string;
    // LDAP specific
    serverUrl?: string;
    baseDN?: string;
    bindDN?: string;
    searchFilter?: string;
    // Common settings
    redirectUrl?: string;
    scopes?: string[];
    attributeMapping?: Record<string, string>;
  };
  domainRestrictions: string[];
  userProvisioning: {
    enabled: boolean;
    defaultRole: string;
    autoCreate: boolean;
    autoUpdate: boolean;
  };
  securitySettings: {
    forceSSL: boolean;
    sessionTimeout: number;
    mfaRequired: boolean;
    ipWhitelist: string[];
  };
  createdAt: Date;
  lastSync: Date | null;
  userCount: number;
  loginCount: number;
  errorCount: number;
}

interface SSOIntegrationProps {
  providers?: SSOProvider[];
  onProviderCreate?: (provider: Omit<SSOProvider, "id" | "createdAt" | "lastSync" | "userCount" | "loginCount" | "errorCount">) => void;
  onProviderUpdate?: (id: string, provider: Partial<SSOProvider>) => void;
  onProviderDelete?: (id: string) => void;
  onProviderTest?: (id: string) => Promise<boolean>;
}

const ssoProviderTypes = [
  { 
    value: "saml", 
    label: "SAML 2.0", 
    icon: Shield, 
    description: "Security Assertion Markup Language",
    enterprise: true
  },
  { 
    value: "oidc", 
    label: "OpenID Connect", 
    icon: Key, 
    description: "Modern identity layer protocol",
    enterprise: true
  },
  { 
    value: "oauth2", 
    label: "OAuth 2.0", 
    icon: Lock, 
    description: "Authorization framework",
    enterprise: false
  },
  { 
    value: "ldap", 
    label: "LDAP/Active Directory", 
    icon: Building, 
    description: "Directory service protocol",
    enterprise: true
  },
  { 
    value: "azure_ad", 
    label: "Azure Active Directory", 
    icon: Building, 
    description: "Microsoft identity platform",
    enterprise: true
  },
  { 
    value: "google", 
    label: "Google Workspace", 
    icon: Mail, 
    description: "Google identity services",
    enterprise: false
  },
  { 
    value: "okta", 
    label: "Okta", 
    icon: UserCheck, 
    description: "Enterprise identity platform",
    enterprise: true
  },
  { 
    value: "auth0", 
    label: "Auth0", 
    icon: Shield, 
    description: "Universal identity platform",
    enterprise: true
  }
];

const defaultRoles = [
  { value: "viewer", label: "Viewer", description: "Read-only access" },
  { value: "user", label: "User", description: "Standard user access" },
  { value: "analyst", label: "Analyst", description: "Analysis and reporting access" },
  { value: "admin", label: "Administrator", description: "Full administrative access" }
];

const sampleProviders: SSOProvider[] = [
  {
    id: "azure-ad-main",
    name: "Corporate Azure AD",
    provider: "azure_ad",
    status: "active",
    description: "Main corporate Azure Active Directory integration for all employees",
    configuration: {
      clientId: "abc123-def456-ghi789",
      clientSecret: "***",
      authorizationUrl: "https://login.microsoftonline.com/tenant-id/oauth2/v2.0/authorize",
      tokenUrl: "https://login.microsoftonline.com/tenant-id/oauth2/v2.0/token",
      userInfoUrl: "https://graph.microsoft.com/v1.0/me",
      scopes: ["openid", "profile", "email", "User.Read"],
      attributeMapping: {
        email: "mail",
        firstName: "givenName",
        lastName: "surname",
        department: "department"
      }
    },
    domainRestrictions: ["company.com", "subsidiary.com"],
    userProvisioning: {
      enabled: true,
      defaultRole: "user",
      autoCreate: true,
      autoUpdate: true
    },
    securitySettings: {
      forceSSL: true,
      sessionTimeout: 480,
      mfaRequired: true,
      ipWhitelist: []
    },
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userCount: 847,
    loginCount: 12543,
    errorCount: 3
  },
  {
    id: "okta-contractors",
    name: "Contractor Access (Okta)",
    provider: "okta",
    status: "active",
    description: "Okta SSO for external contractors and consultants",
    configuration: {
      clientId: "0oa123abc456def789gh",
      clientSecret: "***",
      authorizationUrl: "https://company.okta.com/oauth2/default/v1/authorize",
      tokenUrl: "https://company.okta.com/oauth2/default/v1/token",
      userInfoUrl: "https://company.okta.com/oauth2/default/v1/userinfo",
      scopes: ["openid", "profile", "email"],
      attributeMapping: {
        email: "email",
        firstName: "given_name",
        lastName: "family_name"
      }
    },
    domainRestrictions: [],
    userProvisioning: {
      enabled: true,
      defaultRole: "viewer",
      autoCreate: false,
      autoUpdate: true
    },
    securitySettings: {
      forceSSL: true,
      sessionTimeout: 240,
      mfaRequired: true,
      ipWhitelist: ["203.0.113.0/24", "198.51.100.0/24"]
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    lastSync: new Date(Date.now() - 30 * 60 * 1000),
    userCount: 23,
    loginCount: 156,
    errorCount: 0
  },
  {
    id: "saml-enterprise",
    name: "Enterprise SAML",
    provider: "saml",
    status: "testing",
    description: "SAML 2.0 integration for enterprise partners",
    configuration: {
      entityId: "https://app.company.com/saml/metadata",
      ssoUrl: "https://partner.idp.com/sso/saml",
      x509Certificate: "-----BEGIN CERTIFICATE-----\nMIIC...\n-----END CERTIFICATE-----",
      attributeMapping: {
        email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        firstName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
        lastName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"
      }
    },
    domainRestrictions: ["partner.com"],
    userProvisioning: {
      enabled: false,
      defaultRole: "user",
      autoCreate: false,
      autoUpdate: false
    },
    securitySettings: {
      forceSSL: true,
      sessionTimeout: 360,
      mfaRequired: false,
      ipWhitelist: []
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastSync: null,
    userCount: 0,
    loginCount: 0,
    errorCount: 2
  }
];

export function SSOIntegration({
  providers = sampleProviders,
  onProviderCreate,
  onProviderUpdate,
  onProviderDelete,
  onProviderTest
}: SSOIntegrationProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<SSOProvider | null>(null);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [newProvider, setNewProvider] = useState<Partial<SSOProvider>>({
    name: "",
    provider: "oidc",
    status: "inactive",
    description: "",
    configuration: {},
    domainRestrictions: [],
    userProvisioning: {
      enabled: true,
      defaultRole: "user",
      autoCreate: true,
      autoUpdate: true
    },
    securitySettings: {
      forceSSL: true,
      sessionTimeout: 480,
      mfaRequired: false,
      ipWhitelist: []
    }
  });

  const handleCreateProvider = () => {
    if (newProvider.name && newProvider.provider) {
      onProviderCreate?.({
        name: newProvider.name!,
        provider: newProvider.provider!,
        status: "inactive",
        description: newProvider.description!,
        configuration: newProvider.configuration!,
        domainRestrictions: newProvider.domainRestrictions!,
        userProvisioning: newProvider.userProvisioning!,
        securitySettings: newProvider.securitySettings!
      });
      setNewProvider({
        name: "",
        provider: "oidc",
        status: "inactive",
        description: "",
        configuration: {},
        domainRestrictions: [],
        userProvisioning: {
          enabled: true,
          defaultRole: "user",
          autoCreate: true,
          autoUpdate: true
        },
        securitySettings: {
          forceSSL: true,
          sessionTimeout: 480,
          mfaRequired: false,
          ipWhitelist: []
        }
      });
      setIsCreateDialogOpen(false);
    }
  };

  const handleTestProvider = async (providerId: string) => {
    setTestingProvider(providerId);
    try {
      const result = await onProviderTest?.(providerId);
      if (result) {
        onProviderUpdate?.(providerId, { status: "active" });
      } else {
        onProviderUpdate?.(providerId, { status: "error" });
      }
    } catch (error) {
      onProviderUpdate?.(providerId, { status: "error" });
    }
    setTestingProvider(null);
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

  const getProviderInfo = (provider: string) => {
    return ssoProviderTypes.find(p => p.value === provider) || ssoProviderTypes[0];
  };

  const formatTimeSince = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCheck className="text-primary" size={20} />
            SSO Integration
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {providers.filter(p => p.status === 'active').length} active
            </Badge>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="create-sso-button">
                  <Plus className="h-4 w-4 mr-1" />
                  Add SSO Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Configure SSO Provider</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <Tabs defaultValue="basic" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="basic">Basic Info</TabsTrigger>
                      <TabsTrigger value="config">Configuration</TabsTrigger>
                      <TabsTrigger value="users">User Settings</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="provider-name">Provider Name</Label>
                          <Input
                            id="provider-name"
                            value={newProvider.name || ""}
                            onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Corporate Azure AD"
                            data-testid="provider-name-input"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="provider-type">Provider Type</Label>
                          <Select
                            value={newProvider.provider}
                            onValueChange={(value) => setNewProvider(prev => ({ ...prev, provider: value as any }))}
                          >
                            <SelectTrigger data-testid="provider-type-select">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ssoProviderTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <type.icon className="h-4 w-4" />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        {type.label}
                                        {type.enterprise && (
                                          <Badge variant="secondary" className="text-xs">Enterprise</Badge>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground">{type.description}</div>
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="provider-description">Description</Label>
                        <Textarea
                          id="provider-description"
                          value={newProvider.description || ""}
                          onChange={(e) => setNewProvider(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the purpose and scope of this SSO provider..."
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="domain-restrictions">Domain Restrictions</Label>
                        <Textarea
                          id="domain-restrictions"
                          value={(newProvider.domainRestrictions || []).join('\n')}
                          onChange={(e) => setNewProvider(prev => ({ 
                            ...prev, 
                            domainRestrictions: e.target.value.split('\n').filter(d => d.trim()) 
                          }))}
                          placeholder="company.com&#10;subsidiary.com&#10;&#10;Leave empty to allow all domains"
                          rows={3}
                        />
                        <div className="text-xs text-muted-foreground">
                          Enter one domain per line. Users must have email addresses from these domains.
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="config" className="space-y-4">
                      {newProvider.provider === "oidc" && (
                        <div className="space-y-4">
                          <h4 className="font-medium">OpenID Connect Configuration</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="client-id">Client ID</Label>
                              <Input
                                id="client-id"
                                value={newProvider.configuration?.clientId || ""}
                                onChange={(e) => setNewProvider(prev => ({
                                  ...prev,
                                  configuration: { ...prev.configuration, clientId: e.target.value }
                                }))}
                                placeholder="Your OIDC client ID"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="client-secret">Client Secret</Label>
                              <Input
                                id="client-secret"
                                type="password"
                                value={newProvider.configuration?.clientSecret || ""}
                                onChange={(e) => setNewProvider(prev => ({
                                  ...prev,
                                  configuration: { ...prev.configuration, clientSecret: e.target.value }
                                }))}
                                placeholder="Your OIDC client secret"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="authorization-url">Authorization URL</Label>
                            <Input
                              id="authorization-url"
                              value={newProvider.configuration?.authorizationUrl || ""}
                              onChange={(e) => setNewProvider(prev => ({
                                ...prev,
                                configuration: { ...prev.configuration, authorizationUrl: e.target.value }
                              }))}
                              placeholder="https://provider.com/oauth2/authorize"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="token-url">Token URL</Label>
                            <Input
                              id="token-url"
                              value={newProvider.configuration?.tokenUrl || ""}
                              onChange={(e) => setNewProvider(prev => ({
                                ...prev,
                                configuration: { ...prev.configuration, tokenUrl: e.target.value }
                              }))}
                              placeholder="https://provider.com/oauth2/token"
                            />
                          </div>
                        </div>
                      )}

                      {newProvider.provider === "saml" && (
                        <div className="space-y-4">
                          <h4 className="font-medium">SAML 2.0 Configuration</h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="entity-id">Entity ID</Label>
                              <Input
                                id="entity-id"
                                value={newProvider.configuration?.entityId || ""}
                                onChange={(e) => setNewProvider(prev => ({
                                  ...prev,
                                  configuration: { ...prev.configuration, entityId: e.target.value }
                                }))}
                                placeholder="https://yourapp.com/saml/metadata"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="sso-url">SSO URL</Label>
                              <Input
                                id="sso-url"
                                value={newProvider.configuration?.ssoUrl || ""}
                                onChange={(e) => setNewProvider(prev => ({
                                  ...prev,
                                  configuration: { ...prev.configuration, ssoUrl: e.target.value }
                                }))}
                                placeholder="https://idp.com/sso/saml"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="x509-certificate">X.509 Certificate</Label>
                              <Textarea
                                id="x509-certificate"
                                value={newProvider.configuration?.x509Certificate || ""}
                                onChange={(e) => setNewProvider(prev => ({
                                  ...prev,
                                  configuration: { ...prev.configuration, x509Certificate: e.target.value }
                                }))}
                                placeholder="-----BEGIN CERTIFICATE-----&#10;MIICertificate...&#10;-----END CERTIFICATE-----"
                                rows={4}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="user-provisioning"
                            checked={newProvider.userProvisioning?.enabled || false}
                            onCheckedChange={(checked) => setNewProvider(prev => ({
                              ...prev,
                              userProvisioning: {
                                ...prev.userProvisioning!,
                                enabled: checked
                              }
                            }))}
                          />
                          <Label htmlFor="user-provisioning">Enable User Provisioning</Label>
                        </div>

                        {newProvider.userProvisioning?.enabled && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="default-role">Default Role</Label>
                              <Select
                                value={newProvider.userProvisioning?.defaultRole || "user"}
                                onValueChange={(value) => setNewProvider(prev => ({
                                  ...prev,
                                  userProvisioning: {
                                    ...prev.userProvisioning!,
                                    defaultRole: value
                                  }
                                }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {defaultRoles.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                      <div>
                                        <div>{role.label}</div>
                                        <div className="text-xs text-muted-foreground">{role.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="auto-create"
                                  checked={newProvider.userProvisioning?.autoCreate || false}
                                  onCheckedChange={(checked) => setNewProvider(prev => ({
                                    ...prev,
                                    userProvisioning: {
                                      ...prev.userProvisioning!,
                                      autoCreate: checked
                                    }
                                  }))}
                                />
                                <Label htmlFor="auto-create" className="text-sm">Auto-create users</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="auto-update"
                                  checked={newProvider.userProvisioning?.autoUpdate || false}
                                  onCheckedChange={(checked) => setNewProvider(prev => ({
                                    ...prev,
                                    userProvisioning: {
                                      ...prev.userProvisioning!,
                                      autoUpdate: checked
                                    }
                                  }))}
                                />
                                <Label htmlFor="auto-update" className="text-sm">Auto-update profiles</Label>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="force-ssl"
                            checked={newProvider.securitySettings?.forceSSL || false}
                            onCheckedChange={(checked) => setNewProvider(prev => ({
                              ...prev,
                              securitySettings: {
                                ...prev.securitySettings!,
                                forceSSL: checked
                              }
                            }))}
                          />
                          <Label htmlFor="force-ssl">Force SSL/TLS</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="mfa-required"
                            checked={newProvider.securitySettings?.mfaRequired || false}
                            onCheckedChange={(checked) => setNewProvider(prev => ({
                              ...prev,
                              securitySettings: {
                                ...prev.securitySettings!,
                                mfaRequired: checked
                              }
                            }))}
                          />
                          <Label htmlFor="mfa-required">Require Multi-Factor Authentication</Label>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                          <Input
                            id="session-timeout"
                            type="number"
                            value={newProvider.securitySettings?.sessionTimeout || 480}
                            onChange={(e) => setNewProvider(prev => ({
                              ...prev,
                              securitySettings: {
                                ...prev.securitySettings!,
                                sessionTimeout: parseInt(e.target.value) || 480
                              }
                            }))}
                            placeholder="480"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ip-whitelist">IP Whitelist (CIDR notation)</Label>
                          <Textarea
                            id="ip-whitelist"
                            value={(newProvider.securitySettings?.ipWhitelist || []).join('\n')}
                            onChange={(e) => setNewProvider(prev => ({
                              ...prev,
                              securitySettings: {
                                ...prev.securitySettings!,
                                ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim())
                              }
                            }))}
                            placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;&#10;Leave empty to allow all IPs"
                            rows={3}
                          />
                          <div className="text-xs text-muted-foreground">
                            Restrict access to specific IP ranges. One range per line.
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleCreateProvider} disabled={!newProvider.name || !newProvider.provider}>
                      Create SSO Provider
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
        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            <div className="grid gap-4">
              {providers.map((provider) => {
                const providerInfo = getProviderInfo(provider.provider);
                const ProviderIcon = providerInfo.icon;

                return (
                  <Card key={provider.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <ProviderIcon className="h-6 w-6" />
                        </div>
                        <div className="space-y-3 flex-1">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold">{provider.name}</h3>
                              <Badge className={`text-xs ${getStatusColor(provider.status)} border-0`}>
                                {getStatusIcon(provider.status)}
                                {provider.status}
                              </Badge>
                              {providerInfo.enterprise && (
                                <Badge variant="secondary" className="text-xs">Enterprise</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{provider.description}</p>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Type:</span> {providerInfo.label}
                              {provider.domainRestrictions.length > 0 && (
                                <>
                                  {" • "}
                                  <span className="font-medium">Domains:</span> {provider.domainRestrictions.join(", ")}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Users</div>
                              <div className="text-muted-foreground">{provider.userCount}</div>
                            </div>
                            <div>
                              <div className="font-medium">Logins</div>
                              <div className="text-muted-foreground">{provider.loginCount}</div>
                            </div>
                            <div>
                              <div className="font-medium">Last Sync</div>
                              <div className="text-muted-foreground">{formatTimeSince(provider.lastSync)}</div>
                            </div>
                            <div>
                              <div className="font-medium">Errors</div>
                              <div className="text-muted-foreground">{provider.errorCount}</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 text-xs">
                            {provider.securitySettings.forceSSL && (
                              <Badge variant="outline" className="text-xs">
                                <Lock className="h-3 w-3 mr-1" />
                                SSL Required
                              </Badge>
                            )}
                            {provider.securitySettings.mfaRequired && (
                              <Badge variant="outline" className="text-xs">
                                <Smartphone className="h-3 w-3 mr-1" />
                                MFA Required
                              </Badge>
                            )}
                            {provider.userProvisioning.enabled && (
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                Auto Provisioning
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestProvider(provider.id)}
                          disabled={testingProvider === provider.id}
                          data-testid={`test-sso-${provider.id}`}
                        >
                          {testingProvider === provider.id ? (
                            <Clock className="h-4 w-4 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4" />
                          )}
                          Test
                        </Button>
                        <Switch
                          checked={provider.status === "active"}
                          onCheckedChange={(checked) => 
                            onProviderUpdate?.(provider.id, { status: checked ? "active" : "inactive" })
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProvider(provider)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onProviderDelete?.(provider.id)}
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

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {providers.reduce((acc, p) => acc + p.userCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total SSO Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {providers.reduce((acc, p) => acc + p.loginCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Logins</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {providers.filter(p => p.status === 'active').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Providers</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {providers.reduce((acc, p) => acc + p.errorCount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Recent Errors</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">User Distribution by Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providers
                    .sort((a, b) => b.userCount - a.userCount)
                    .map((provider) => {
                      const percentage = Math.round((provider.userCount / providers.reduce((acc, p) => acc + p.userCount, 0)) * 100);
                      return (
                        <div key={provider.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-sm text-muted-foreground">{provider.provider.toUpperCase()}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary rounded-full h-2" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="text-sm font-medium w-16 text-right">
                              {provider.userCount} ({percentage}%)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Authentication Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providers
                    .filter(p => p.lastSync)
                    .sort((a, b) => (b.lastSync?.getTime() || 0) - (a.lastSync?.getTime() || 0))
                    .slice(0, 10)
                    .map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(provider.status)}
                          <div>
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Last authentication: {provider.lastSync?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-medium">{provider.userCount} users</div>
                          <div className="text-muted-foreground">{provider.loginCount} total logins</div>
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