import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  Database, 
  MemoryStick, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface SystemHealthWidgetProps {
  systemHealth?: {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    responseTime: {
      avg: number;
      p95: number;
      p99: number;
    };
    errorRate: number;
    databaseHealth: 'healthy' | 'degraded' | 'down';
  };
  refreshInterval?: number;
}

export function SystemHealthWidget({ systemHealth, refreshInterval = 30000 }: SystemHealthWidgetProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch real-time metrics
  const { data: realtimeMetrics, refetch } = useQuery({
    queryKey: ['/api/monitoring/metrics/realtime'],
    refetchInterval: refreshInterval,
    enabled: !!systemHealth,
    throwOnError: false,
    retry: false
  });

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!systemHealth) {
    return (
      <Card data-testid="system-health-loading">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Loading system health data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="system-health-widget">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              {getHealthIcon(systemHealth.status)}
              <span>System Health</span>
            </CardTitle>
            <CardDescription>
              Real-time system monitoring and performance metrics
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              className={getHealthColor(systemHealth.status)}
              data-testid="health-status-badge"
            >
              {systemHealth.status.toUpperCase()}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              data-testid="refresh-health-button"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Uptime */}
        <div className="flex items-center justify-between" data-testid="uptime-section">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Uptime</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatUptime(systemHealth.uptime)}
          </span>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2" data-testid="memory-section">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MemoryStick className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Memory Usage</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {systemHealth.memory.used}MB / {systemHealth.memory.total}MB
            </span>
          </div>
          <Progress 
            value={systemHealth.memory.percentage} 
            className="h-2"
            data-testid="memory-progress"
          />
          <div className="text-right">
            <Badge 
              variant={systemHealth.memory.percentage > 90 ? "destructive" : 
                     systemHealth.memory.percentage > 75 ? "secondary" : "default"}
              className="text-xs"
            >
              {systemHealth.memory.percentage}%
            </Badge>
          </div>
        </div>

        {/* Response Time Metrics */}
        <div className="space-y-3" data-testid="response-time-section">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Response Time</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold">{systemHealth.responseTime.avg}ms</div>
              <div className="text-xs text-muted-foreground">Average</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">{systemHealth.responseTime.p95}ms</div>
              <div className="text-xs text-muted-foreground">95th %</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">{systemHealth.responseTime.p99}ms</div>
              <div className="text-xs text-muted-foreground">99th %</div>
            </div>
          </div>
        </div>

        {/* Error Rate */}
        <div className="flex items-center justify-between" data-testid="error-rate-section">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Error Rate</span>
          </div>
          <Badge 
            variant={systemHealth.errorRate > 10 ? "destructive" : 
                   systemHealth.errorRate > 5 ? "secondary" : "default"}
          >
            {systemHealth.errorRate}/min
          </Badge>
        </div>

        {/* Database Health */}
        <div className="flex items-center justify-between" data-testid="database-section">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Database</span>
          </div>
          <div className="flex items-center space-x-2">
            {getHealthIcon(systemHealth.databaseHealth)}
            <span className="text-sm capitalize">
              {systemHealth.databaseHealth}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        {systemHealth.status !== 'healthy' && (
          <div className="pt-4 border-t" data-testid="health-actions">
            <div className="text-sm font-medium mb-2">Recommended Actions:</div>
            <div className="space-y-2 text-xs text-muted-foreground">
              {systemHealth.memory.percentage > 90 && (
                <div>• Memory usage is high - consider scaling or optimization</div>
              )}
              {systemHealth.responseTime.avg > 1000 && (
                <div>• Response times are slow - check for performance bottlenecks</div>
              )}
              {systemHealth.errorRate > 10 && (
                <div>• High error rate detected - review error logs immediately</div>
              )}
              {systemHealth.databaseHealth !== 'healthy' && (
                <div>• Database issues detected - check connection and performance</div>
              )}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Last updated: {new Date().toLocaleTimeString()}
          {refreshInterval && (
            <span> • Auto-refresh every {refreshInterval / 1000}s</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}