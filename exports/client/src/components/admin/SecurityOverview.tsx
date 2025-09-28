import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  UserX, 
  Lock, 
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';

interface SecurityOverviewProps {
  organizationId?: string;
  userRole: string;
  detailed?: boolean;
}

export function SecurityOverview({ organizationId, userRole, detailed = false }: SecurityOverviewProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [resolvedFilter, setResolvedFilter] = useState<string>('unresolved');

  // Fetch security events
  const { data: securityEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/security-events', organizationId, severityFilter, resolvedFilter],
    enabled: ['super_admin', 'admin'].includes(userRole),
    throwOnError: false,
    retry: false
  });

  // Fetch recent audit logs for security context
  const { data: auditLogs } = useQuery({
    queryKey: ['/api/audit-logs', organizationId, undefined, 20],
    enabled: ['super_admin', 'admin'].includes(userRole),
    throwOnError: false,
    retry: false
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'sql_injection': return <UserX className="h-4 w-4 text-red-500" />;
      case 'xss_attempt': return <Zap className="h-4 w-4 text-orange-500" />;
      case 'rate_limit_exceeded': return <Lock className="h-4 w-4 text-yellow-500" />;
      case 'unauthorized_access': return <Eye className="h-4 w-4 text-purple-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!['super_admin', 'admin'].includes(userRole)) {
    return (
      <Card data-testid="security-access-denied">
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
          <CardDescription>Access denied - Administrative privileges required</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="security-overview">
      {/* Security Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="security-stats-total">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityEvents?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total events recorded
            </p>
          </CardContent>
        </Card>

        <Card data-testid="security-stats-unresolved">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unresolved</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {securityEvents?.events?.filter((e: any) => !e.resolved).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card data-testid="security-stats-critical">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {securityEvents?.events?.filter((e: any) => e.severity === 'critical').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              High priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Events Table */}
      <Card data-testid="security-events-table">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>
                Latest security incidents and threats detected
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={severityFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('all')}
                data-testid="filter-all-severity"
              >
                All
              </Button>
              <Button
                variant={severityFilter === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('critical')}
                data-testid="filter-critical-severity"
              >
                Critical
              </Button>
              <Button
                variant={resolvedFilter === 'unresolved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setResolvedFilter(resolvedFilter === 'unresolved' ? 'all' : 'unresolved')}
                data-testid="filter-resolved-status"
              >
                <Filter className="h-4 w-4 mr-1" />
                {resolvedFilter === 'unresolved' ? 'Unresolved Only' : 'Show All'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : securityEvents?.events?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEvents.events.slice(0, detailed ? 20 : 5).map((event: any) => (
                  <TableRow key={event.id} data-testid={`security-event-${event.id}`}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getEventTypeIcon(event.eventType)}
                        <span className="text-sm font-medium">
                          {event.eventType.replace('_', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {event.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {event.resolved ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs">Resolved</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">Open</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {!event.resolved && (
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`resolve-event-${event.id}`}
                        >
                          Resolve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-security-events">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No security events found</p>
              <p className="text-sm">Your system is secure</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Security Activity */}
      {detailed && (
        <Card data-testid="recent-security-activity">
          <CardHeader>
            <CardTitle>Recent Security Activity</CardTitle>
            <CardDescription>
              Latest security-related actions and events from audit logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {auditLogs?.logs?.length > 0 ? (
              <div className="space-y-3">
                {auditLogs.logs
                  .filter((log: any) => 
                    log.action.includes('security') || 
                    log.action.includes('login') ||
                    log.action.includes('admin')
                  )
                  .slice(0, 10)
                  .map((log: any) => (
                    <div 
                      key={log.id} 
                      className="flex items-center justify-between p-3 border rounded-lg"
                      data-testid={`security-activity-${log.id}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            User: {log.userId || 'Anonymous'} • {log.resourceType}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent security activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}