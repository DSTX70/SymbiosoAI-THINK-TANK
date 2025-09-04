import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Database, 
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface UsageAnalyticsProps {
  organizationId?: string;
  userRole: string;
}

export function UsageAnalytics({ organizationId, userRole }: UsageAnalyticsProps) {
  const [timePeriod, setTimePeriod] = useState('week');
  const [selectedOrganization, setSelectedOrganization] = useState(organizationId || 'all');

  // Fetch usage analytics data
  const { data: usageAnalytics, isLoading } = useQuery({
    queryKey: ['/api/usage/analytics', selectedOrganization === 'all' ? undefined : selectedOrganization, timePeriod],
    enabled: ['super_admin', 'admin', 'manager'].includes(userRole),
    throwOnError: false,
    retry: false
  });

  // Fetch quota status
  const { data: quotaStatus } = useQuery({
    queryKey: ['/api/usage/quotas', selectedOrganization],
    enabled: selectedOrganization !== 'all' && ['super_admin', 'admin', 'manager'].includes(userRole),
    throwOnError: false,
    retry: false
  });

  // Fetch organization list for super admins
  const { data: organizations } = useQuery({
    queryKey: ['/api/organizations'],
    enabled: userRole === 'super_admin',
    throwOnError: false,
    retry: false
  });

  const getQuotaStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-50 border-red-200';
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getQuotaIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertCircle className="h-4 w-4 text-red-500" />;
    if (percentage >= 75) return <Clock className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (!['super_admin', 'admin', 'manager'].includes(userRole)) {
    return (
      <Card data-testid="usage-access-denied">
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
          <CardDescription>Access denied - Management privileges required</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="usage-analytics">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-40" data-testid="time-period-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {userRole === 'super_admin' && organizations?.organizations && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization</label>
              <Select value={selectedOrganization} onValueChange={setSelectedOrganization}>
                <SelectTrigger className="w-48" data-testid="organization-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Organizations</SelectItem>
                  {organizations.organizations.map((org: any) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Quota Status Overview */}
      {quotaStatus && (
        <Card data-testid="quota-status-card">
          <CardHeader>
            <CardTitle>Usage Quotas</CardTitle>
            <CardDescription>
              Current usage against organizational limits for {selectedOrganization}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quotaStatus.quotas.map((quota: any) => (
                <div key={quota.type} className="space-y-2" data-testid={`quota-${quota.type}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getQuotaIcon(quota.percentage)}
                      <span className="text-sm font-medium">
                        {quota.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </span>
                    </div>
                    <Badge className={getQuotaStatusColor(quota.percentage)}>
                      {quota.percentage}%
                    </Badge>
                  </div>
                  <Progress 
                    value={quota.percentage} 
                    className="h-2"
                    data-testid={`quota-progress-${quota.type}`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{quota.used.toLocaleString()} used</span>
                    <span>{quota.limit.toLocaleString()} limit</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quota Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {quotaStatus.summary.totalQuotas - quotaStatus.summary.exceeded - quotaStatus.summary.warnings}
                  </div>
                  <div className="text-xs text-muted-foreground">Healthy</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-yellow-600">
                    {quotaStatus.summary.warnings}
                  </div>
                  <div className="text-xs text-muted-foreground">Warnings</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">
                    {quotaStatus.summary.exceeded}
                  </div>
                  <div className="text-xs text-muted-foreground">Exceeded</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card data-testid="usage-trends-card">
          <CardHeader>
            <CardTitle>Usage Trends</CardTitle>
            <CardDescription>
              Platform usage patterns over {timePeriod}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
            ) : usageAnalytics ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">API Calls</span>
                  </div>
                  <span className="text-sm font-medium">
                    {usageAnalytics.usage?.api_calls?.toLocaleString() || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">AI Analyses</span>
                  </div>
                  <span className="text-sm font-medium">
                    {usageAnalytics.usage?.ai_analyses?.toLocaleString() || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Storage Used</span>
                  </div>
                  <span className="text-sm font-medium">
                    {(usageAnalytics.usage?.storage_used || 0)} MB
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Peak Sessions</span>
                  </div>
                  <span className="text-sm font-medium">
                    {usageAnalytics.usage?.concurrent_sessions || 0}
                  </span>
                </div>

                {/* Growth Indicators */}
                {usageAnalytics.trends && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm font-medium mb-1">Growth Rate</div>
                    <div className="text-2xl font-bold text-blue-600">
                      +{usageAnalytics.trends.growth_rate}%
                    </div>
                    <div className="text-xs text-muted-foreground">vs previous period</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No usage data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Alerts */}
        <Card data-testid="usage-alerts-card">
          <CardHeader>
            <CardTitle>Usage Alerts</CardTitle>
            <CardDescription>
              Automated alerts and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usageAnalytics?.alerts?.length > 0 ? (
              <div className="space-y-3">
                {usageAnalytics.alerts.map((alert: any, index: number) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'high' ? 'bg-red-50 border-red-200 dark:bg-red-900/20' :
                      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20' :
                      'bg-blue-50 border-blue-200 dark:bg-blue-900/20'
                    }`}
                    data-testid={`usage-alert-${index}`}
                  >
                    <div className="flex items-start space-x-3">
                      <AlertCircle className={`h-4 w-4 mt-0.5 ${
                        alert.severity === 'high' ? 'text-red-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium">{alert.type}</div>
                        <div className="text-sm text-muted-foreground">{alert.message}</div>
                        {alert.action && (
                          <div className="text-xs text-blue-600 mt-1">
                            Recommended: {alert.action}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No usage alerts</p>
                <p className="text-sm">All systems within normal limits</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}