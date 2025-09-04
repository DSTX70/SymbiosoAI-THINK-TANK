import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Activity,
  Server,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface PerformanceMonitoringProps {
  organizationId?: string;
  userRole: string;
}

export function PerformanceMonitoring({ organizationId, userRole }: PerformanceMonitoringProps) {
  const [timeRange, setTimeRange] = useState('1h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch performance analytics
  const { data: performanceData, isLoading, refetch } = useQuery({
    queryKey: ['/api/monitoring/performance', organizationId, timeRange],
    enabled: ['super_admin', 'admin', 'manager'].includes(userRole),
    refetchInterval: 30000, // 30 seconds
    throwOnError: false,
    retry: false
  });

  // Fetch error analytics
  const { data: errorData } = useQuery({
    queryKey: ['/api/monitoring/errors', organizationId, '24h'],
    enabled: ['super_admin', 'admin'].includes(userRole),
    throwOnError: false,
    retry: false
  });

  // Fetch real-time system metrics
  const { data: realtimeMetrics } = useQuery({
    queryKey: ['/api/monitoring/metrics/realtime', organizationId],
    enabled: ['super_admin', 'admin'].includes(userRole),
    refetchInterval: 10000, // 10 seconds
    throwOnError: false,
    retry: false
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!['super_admin', 'admin', 'manager'].includes(userRole)) {
    return (
      <Card data-testid="performance-access-denied">
        <CardHeader>
          <CardTitle>Performance Monitoring</CardTitle>
          <CardDescription>Access denied - Management privileges required</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6" data-testid="performance-monitoring">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Performance Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Real-time system performance metrics and analytics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32" data-testid="time-range-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            data-testid="refresh-performance"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card data-testid="metric-response-time">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(
              realtimeMetrics?.metrics?.response_time_avg || 0, 
              { good: 200, warning: 500 }
            )}`}>
              {realtimeMetrics?.metrics?.response_time_avg || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              P95: {realtimeMetrics?.metrics?.response_time_p95 || 0}ms
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-throughput">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              Throughput
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData?.summary?.totalRequests || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              requests in {timeRange}
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-error-rate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(
              realtimeMetrics?.metrics?.error_rate || 0,
              { good: 1, warning: 5 }
            )}`}>
              {realtimeMetrics?.metrics?.error_rate || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              errors per minute
            </p>
          </CardContent>
        </Card>

        <Card data-testid="metric-uptime">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Server className="h-4 w-4 mr-2 text-purple-500" />
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.floor((realtimeMetrics?.metrics?.uptime_seconds || 0) / 3600)}h
            </div>
            <p className="text-xs text-muted-foreground">
              continuous operation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trends */}
        <Card data-testid="response-time-trends">
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
            <CardDescription>
              Average response time over {timeRange}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            ) : performanceData?.trends?.responseTimeTrend ? (
              <div className="space-y-4">
                {/* Mock chart representation */}
                <div className="h-48 border rounded-lg p-4 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/20">
                  <div className="h-full flex items-end space-x-2">
                    {performanceData.trends.responseTimeTrend.slice(0, 12).map((point: any, index: number) => (
                      <div 
                        key={index}
                        className="flex-1 bg-blue-500 rounded-t"
                        style={{ height: `${Math.max(10, (point.value / 1000) * 100)}%` }}
                        title={`${new Date(point.timestamp).toLocaleTimeString()}: ${point.value}ms`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Response time trend over the last {timeRange}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No performance data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Slowest Endpoints */}
        <Card data-testid="slowest-endpoints">
          <CardHeader>
            <CardTitle>Slowest Endpoints</CardTitle>
            <CardDescription>
              Endpoints with highest average response times
            </CardDescription>
          </CardHeader>
          <CardContent>
            {performanceData?.summary?.slowestEndpoints?.length > 0 ? (
              <div className="space-y-3">
                {performanceData.summary.slowestEndpoints.map((endpoint: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    data-testid={`slow-endpoint-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-8 rounded ${
                        endpoint.avgTime > 1000 ? 'bg-red-500' :
                        endpoint.avgTime > 500 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium">{endpoint.endpoint}</div>
                        <div className="text-xs text-muted-foreground">
                          Avg: {endpoint.avgTime}ms
                        </div>
                      </div>
                    </div>
                    <Badge variant={endpoint.avgTime > 1000 ? "destructive" : 
                                  endpoint.avgTime > 500 ? "secondary" : "default"}>
                      {endpoint.avgTime}ms
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No endpoint data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Error Analytics */}
      {['super_admin', 'admin'].includes(userRole) && errorData && (
        <Card data-testid="error-analytics">
          <CardHeader>
            <CardTitle>Error Analytics</CardTitle>
            <CardDescription>
              Error patterns and recent incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Error Summary */}
              <div className="space-y-4">
                <div className="text-sm font-medium">Error Summary (24h)</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-lg font-semibold text-red-600">
                      {errorData.summary?.totalErrors || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Errors</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-lg font-semibold text-orange-600">
                      {errorData.summary?.criticalErrors || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Critical</div>
                  </div>
                </div>
              </div>

              {/* Top Error Types */}
              <div className="space-y-4">
                <div className="text-sm font-medium">Top Error Types</div>
                {errorData.errorTypes?.length > 0 ? (
                  <div className="space-y-2">
                    {errorData.errorTypes.slice(0, 5).map((errorType: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between"
                        data-testid={`error-type-${index}`}
                      >
                        <span className="text-sm">{errorType.type}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{errorType.count}</span>
                          <Badge variant="outline" className="text-xs">
                            {errorType.percentage}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No error data available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Alerts */}
      {realtimeMetrics?.alerts?.length > 0 && (
        <Card data-testid="performance-alerts">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Performance Alerts
            </CardTitle>
            <CardDescription>
              Active performance issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realtimeMetrics.alerts.map((alert: any, index: number) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'high' ? 'bg-red-50 border-red-200 dark:bg-red-900/20' :
                    'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20'
                  }`}
                  data-testid={`performance-alert-${index}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium">{alert.type.replace('_', ' ')}</div>
                      <div className="text-sm text-muted-foreground">{alert.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <Badge 
                      variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}