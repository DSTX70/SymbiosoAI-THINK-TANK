import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  Activity,
  Shield,
  Database,
  Globe,
  RefreshCw
} from 'lucide-react';

interface AuditLogViewerProps {
  organizationId?: string;
  userRole: string;
}

export function AuditLogViewer({ organizationId, userRole }: AuditLogViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('24h');
  const [expandedLog, setExpandedLog] = useState<string>('');

  // Fetch audit logs with filters
  const { data: auditLogs, isLoading, refetch } = useQuery({
    queryKey: ['/api/audit-logs', organizationId, actionFilter === 'all' ? undefined : actionFilter],
    enabled: ['super_admin', 'admin'].includes(userRole),
    throwOnError: false,
    retry: false
  });

  // Common actions for filtering
  const commonActions = [
    'all',
    'user_login',
    'user_logout', 
    'organization_created',
    'team_created',
    'security_event',
    'rate_limit_exceeded',
    'admin_action'
  ];

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('logout')) return <User className="h-4 w-4 text-blue-500" />;
    if (action.includes('security')) return <Shield className="h-4 w-4 text-red-500" />;
    if (action.includes('organization') || action.includes('team')) return <Activity className="h-4 w-4 text-green-500" />;
    if (action.includes('database')) return <Database className="h-4 w-4 text-purple-500" />;
    return <Globe className="h-4 w-4 text-gray-500" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete') || action.includes('security')) return 'text-red-600 bg-red-50 border-red-200';
    if (action.includes('admin') || action.includes('modify')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (action.includes('create') || action.includes('login')) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const formatLogDetails = (details: any) => {
    if (!details || typeof details !== 'object') return 'No additional details';
    
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(', ');
  };

  const handleExport = async () => {
    // In real implementation, this would trigger CSV/JSON export
    console.log('Exporting audit logs...');
  };

  if (!['super_admin', 'admin'].includes(userRole)) {
    return (
      <Card data-testid="audit-access-denied">
        <CardHeader>
          <CardTitle>Audit Log Viewer</CardTitle>
          <CardDescription>Access denied - Administrator privileges required</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="audit-log-viewer">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Audit Log Viewer</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive audit trail for compliance and security monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            data-testid="export-audit-logs"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            data-testid="refresh-audit-logs"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card data-testid="audit-filters">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search actions or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="search-audit-logs"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger data-testid="filter-action-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {commonActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action === 'all' ? 'All Actions' : action.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger data-testid="filter-time-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setSearchTerm('');
                  setActionFilter('all');
                  setTimeFilter('24h');
                }}
                data-testid="clear-filters"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card data-testid="audit-logs-table">
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            Showing {auditLogs?.logs?.length || 0} of {auditLogs?.total || 0} audit log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : auditLogs?.logs?.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.logs
                  .filter((log: any) => {
                    const matchesSearch = searchTerm === '' || 
                      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      log.userId?.toLowerCase().includes(searchTerm.toLowerCase());
                    
                    const matchesAction = actionFilter === 'all' || 
                      log.action.includes(actionFilter);
                    
                    return matchesSearch && matchesAction;
                  })
                  .map((log: any) => (
                    <TableRow 
                      key={log.id} 
                      className={expandedLog === log.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      data-testid={`audit-log-${log.id}`}
                    >
                      <TableCell>
                        <div className="text-sm">
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {log.userId || 'Anonymous'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {log.resourceType && (
                            <span className="font-medium">{log.resourceType}</span>
                          )}
                          {log.resourceId && (
                            <div className="text-xs text-muted-foreground truncate max-w-24">
                              {log.resourceId}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {log.ipAddress || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                          Success
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedLog(expandedLog === log.id ? '' : log.id)}
                          data-testid={`expand-log-${log.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-audit-logs">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit logs found</p>
              <p className="text-sm">
                {searchTerm || actionFilter !== 'all' ? 'Try adjusting your filters' : 'No activity recorded yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expanded Log Details */}
      {expandedLog && auditLogs?.logs && (
        <Card data-testid={`expanded-log-${expandedLog}`}>
          <CardHeader>
            <CardTitle>Audit Log Details</CardTitle>
            <CardDescription>
              Detailed information for log entry {expandedLog}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const log = auditLogs.logs.find((l: any) => l.id === expandedLog);
              if (!log) return <p>Log not found</p>;
              
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Action:</span>
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">User ID:</span>
                          <span className="font-mono">{log.userId || 'Anonymous'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Timestamp:</span>
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">IP Address:</span>
                          <span className="font-mono">{log.ipAddress || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Resource Information */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Resource Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resource Type:</span>
                          <span>{log.resourceType || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resource ID:</span>
                          <span className="font-mono text-xs">{log.resourceId || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Organization:</span>
                          <span>{log.organizationId || 'Global'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Agent and Details */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Additional Details</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-muted-foreground">User Agent:</span>
                        <p className="text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded mt-1">
                          {log.userAgent || 'Not available'}
                        </p>
                      </div>
                      {log.details && (
                        <div>
                          <span className="text-sm text-muted-foreground">Log Details:</span>
                          <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="audit-stats-total">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              in selected timeframe
            </p>
          </CardContent>
        </Card>

        <Card data-testid="audit-stats-users">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs?.logs ? 
                new Set(auditLogs.logs.map((log: any) => log.userId).filter(Boolean)).size : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              unique users tracked
            </p>
          </CardContent>
        </Card>

        <Card data-testid="audit-stats-actions">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Action Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs?.logs ? 
                new Set(auditLogs.logs.map((log: any) => log.action)).size : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              different actions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}