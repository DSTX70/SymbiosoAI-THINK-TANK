import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  BarChart3, 
  Users, 
  AlertTriangle, 
  Activity, 
  Database,
  Clock,
  Zap,
  TrendingUp,
  Settings,
  Eye,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { SystemHealthWidget } from './admin/SystemHealthWidget';
import { SecurityOverview } from './admin/SecurityOverview';
import { UsageAnalytics } from './admin/UsageAnalytics';
import { OrganizationManager } from './admin/OrganizationManager';
import { PerformanceMonitoring } from './admin/PerformanceMonitoring';
import { AuditLogViewer } from './admin/AuditLogViewer';

interface EnterpriseAdminDashboardProps {
  organizationId?: string;
  userRole: 'super_admin' | 'admin' | 'manager' | 'member';
}

interface DashboardStats {
  totalOrganizations: number;
  activeUsers: number;
  securityAlerts: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  errorRate: number;
  avgResponseTime: number;
}

export function EnterpriseAdminDashboard({ organizationId, userRole }: EnterpriseAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Fetch dashboard overview statistics
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard/stats', organizationId],
    refetchInterval: refreshInterval,
    enabled: ['super_admin', 'admin'].includes(userRole)
  });

  // Fetch system health data
  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/health'],
    refetchInterval: 10000, // 10 seconds for health data
  });

  // Permission check for admin features
  const canViewSystemHealth = ['super_admin', 'admin'].includes(userRole);
  const canManageOrganizations = ['super_admin'].includes(userRole);
  const canViewAuditLogs = ['super_admin', 'admin'].includes(userRole);

  if (statsLoading && healthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-testid="loading-dashboard">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="enterprise-admin-dashboard">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="dashboard-title">
              Enterprise Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400" data-testid="dashboard-subtitle">
              Monitor and manage your SymbiosoAi ThinkTank enterprise platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge 
              variant={userRole === 'super_admin' ? 'default' : 'secondary'}
              data-testid="user-role-badge"
            >
              {userRole.replace('_', ' ').toUpperCase()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRefreshInterval(refreshInterval === 30000 ? 10000 : 30000)}
              data-testid="refresh-toggle"
            >
              <Activity className="h-4 w-4 mr-2" />
              {refreshInterval === 10000 ? 'Fast Refresh' : 'Normal Refresh'}
            </Button>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-testid="stat-organizations">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Organizations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats?.totalOrganizations || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active organizations
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-users">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats?.activeUsers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-security">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dashboardStats?.securityAlerts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Unresolved alerts
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stat-health">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${
                  systemHealth?.status === 'healthy' ? 'text-green-600' :
                  systemHealth?.status === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {systemHealth?.status === 'healthy' ? <CheckCircle className="h-6 w-6" /> :
                   systemHealth?.status === 'warning' ? <AlertTriangle className="h-6 w-6" /> :
                   <XCircle className="h-6 w-6" />}
                </div>
                <span className="text-sm capitalize">
                  {systemHealth?.status || 'Unknown'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full gap-1" data-testid="dashboard-tabs">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="performance" data-testid="tab-performance">
              <Zap className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="usage" data-testid="tab-usage">
              <TrendingUp className="h-4 w-4 mr-2" />
              Usage
            </TabsTrigger>
            {canManageOrganizations && (
              <TabsTrigger value="organizations" data-testid="tab-organizations">
                <Users className="h-4 w-4 mr-2" />
                Organizations
              </TabsTrigger>
            )}
            {canViewAuditLogs && (
              <TabsTrigger value="audit" data-testid="tab-audit">
                <Eye className="h-4 w-4 mr-2" />
                Audit Logs
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" data-testid="content-overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {canViewSystemHealth && (
                <SystemHealthWidget 
                  systemHealth={systemHealth}
                  refreshInterval={refreshInterval}
                  data-testid="system-health-widget"
                />
              )}
              <SecurityOverview 
                organizationId={organizationId}
                userRole={userRole}
                data-testid="security-overview"
              />
            </div>
            
            <div className="mt-6">
              <Card data-testid="recent-activity">
                <CardHeader>
                  <CardTitle>Recent Platform Activity</CardTitle>
                  <CardDescription>
                    Latest events and system updates across the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mock recent activity - in real implementation, fetch from API */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">New organization registered</p>
                          <p className="text-xs text-muted-foreground">Acme Corp - 2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Rate limit threshold reached</p>
                          <p className="text-xs text-muted-foreground">Enterprise Org - 15 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">System health check completed</p>
                          <p className="text-xs text-muted-foreground">All systems operational - 30 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" data-testid="content-security">
            <SecurityOverview 
              organizationId={organizationId}
              userRole={userRole}
              detailed={true}
              data-testid="security-detailed"
            />
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" data-testid="content-performance">
            <PerformanceMonitoring 
              organizationId={organizationId}
              userRole={userRole}
              data-testid="performance-monitoring"
            />
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" data-testid="content-usage">
            <UsageAnalytics 
              organizationId={organizationId}
              userRole={userRole}
              data-testid="usage-analytics"
            />
          </TabsContent>

          {/* Organizations Tab */}
          {canManageOrganizations && (
            <TabsContent value="organizations" data-testid="content-organizations">
              <OrganizationManager 
                userRole={userRole}
                data-testid="organization-manager"
              />
            </TabsContent>
          )}

          {/* Audit Logs Tab */}
          {canViewAuditLogs && (
            <TabsContent value="audit" data-testid="content-audit">
              <AuditLogViewer 
                organizationId={organizationId}
                userRole={userRole}
                data-testid="audit-log-viewer"
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}