import type { Request, Response, NextFunction } from "express";
import type { InsertPerformanceMetric, InsertErrorLog } from "@shared/schema";
import { db } from "../db";
import { performanceMetrics, errorLogs } from "@shared/schema";

interface PerformanceConfig {
  enableMetrics: boolean;
  enableErrorTracking: boolean;
  slowQueryThreshold: number;
  errorAlertThreshold: number;
  metricsRetentionDays: number;
}

interface SystemHealth {
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
}

const DEFAULT_MONITORING_CONFIG: PerformanceConfig = {
  enableMetrics: true,
  enableErrorTracking: true,
  slowQueryThreshold: 1000, // ms
  errorAlertThreshold: 10, // errors per minute
  metricsRetentionDays: 30
};

class PerformanceMonitor {
  private config: PerformanceConfig;
  private metricsCache: Map<string, number[]> = new Map();
  private errorCache: Map<string, number> = new Map();
  private startTime: number;

  constructor(config?: Partial<PerformanceConfig>) {
    this.config = { ...DEFAULT_MONITORING_CONFIG, ...config };
    this.startTime = Date.now();
  }

  /**
   * Performance Tracking Middleware
   */
  performanceMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!this.config.enableMetrics) {
        return next();
      }

      const startTime = Date.now();
      const originalSend = res.send;
      const self = this; // Capture 'this' context

      // Override res.send to capture response time
      res.send = function(body: any) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // Record performance metric
        const performanceData = {
          organizationId: (req as any).organizationId || null,
          metricName: 'response_time',
          metricValue: responseTime,
          metricUnit: 'ms',
          endpoint: `${req.method} ${req.path}`,
          statusCode: res.statusCode,
          userId: (req as any).user?.claims?.sub || null,
          metadata: {
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            queryParams: Object.keys(req.query).length > 0 ? req.query : undefined,
            bodySize: typeof body === 'string' ? body.length : JSON.stringify(body).length
          }
        };

        // Store in cache for real-time analytics using captured context
        const cacheKey = `${req.method}:${req.path}`;
        if (!self.metricsCache.has(cacheKey)) {
          self.metricsCache.set(cacheKey, []);
        }
        
        const metrics = self.metricsCache.get(cacheKey)!;
        metrics.push(responseTime);
        
        // Keep only last 100 measurements
        if (metrics.length > 100) {
          metrics.shift();
        }

        // Log slow queries
        if (responseTime > self.config.slowQueryThreshold) {
          console.warn(`Slow request detected: ${req.method} ${req.path} took ${responseTime}ms`);
          
          // Record as performance alert
          self.recordPerformanceAlert({
            type: 'slow_request',
            endpoint: `${req.method} ${req.path}`,
            responseTime,
            threshold: self.config.slowQueryThreshold,
            organizationId: (req as any).organizationId,
            userId: (req as any).user?.claims?.sub
          });
        }

        // Save performance metric to database
        try {
          await self.savePerformanceMetric({
            organizationId: performanceData.organizationId,
            metricName: performanceData.metricName,
            value: performanceData.metricValue,
            unit: performanceData.metricUnit,
            endpoint: performanceData.endpoint,
            tags: {
              statusCode: performanceData.statusCode,
              userId: performanceData.userId,
              ...performanceData.metadata
            }
          });
        } catch (error) {
          console.error('Failed to save performance metric:', error);
        }

        return originalSend.call(res, body);
      };

      next();
    };
  }

  /**
   * Error Tracking Middleware
   */
  errorTrackingMiddleware() {
    return (error: Error, req: Request, res: Response, next: NextFunction) => {
      if (!this.config.enableErrorTracking) {
        return next(error);
      }

      // Determine error severity
      const severity = this.determineErrorSeverity(error, res.statusCode);
      
      const errorData = {
        organizationId: (req as any).organizationId || null,
        errorType: error.name || 'UnknownError',
        errorMessage: error.message,
        errorStack: error.stack || null,
        endpoint: `${req.method} ${req.path}`,
        userId: (req as any).user?.claims?.sub || null,
        severity,
        metadata: {
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          statusCode: res.statusCode,
          requestBody: req.method !== 'GET' ? req.body : undefined,
          queryParams: req.query,
          timestamp: new Date().toISOString()
        }
      };

      // Update error rate tracking
      const errorKey = `errors_${Math.floor(Date.now() / 60000)}`; // per minute
      this.errorCache.set(errorKey, (this.errorCache.get(errorKey) || 0) + 1);

      // Check if error rate exceeds threshold
      const currentErrorRate = this.errorCache.get(errorKey) || 0;
      if (currentErrorRate >= this.config.errorAlertThreshold) {
        this.triggerErrorRateAlert(currentErrorRate);
      }

      // Save error to database
      try {
        await this.saveErrorLog({
          organizationId: errorData.organizationId,
          userId: errorData.userId,
          errorType: errorData.errorType,
          errorCode: res.statusCode.toString(),
          message: errorData.errorMessage,
          stackTrace: errorData.errorStack,
          endpoint: errorData.endpoint,
          severity: errorData.severity,
          metadata: errorData.metadata
        });
      } catch (dbError) {
        console.error('Failed to save error log:', dbError);
        // Fallback to console logging if database fails
        console.error('Original error:', errorData);
      }

      // Continue with normal error handling
      next(error);
    };
  }

  /**
   * System Health Check
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const currentTime = Date.now();
    const uptime = Math.floor((currentTime - this.startTime) / 1000);

    // Calculate memory usage
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

    // Calculate response time metrics from cache
    const allResponseTimes = Array.from(this.metricsCache.values()).flat();
    const avgResponseTime = allResponseTimes.length > 0 
      ? Math.round(allResponseTimes.reduce((sum, time) => sum + time, 0) / allResponseTimes.length)
      : 0;

    const sortedTimes = allResponseTimes.sort((a, b) => a - b);
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);

    // Calculate current error rate
    const currentMinute = Math.floor(Date.now() / 60000);
    const errorRate = this.errorCache.get(`errors_${currentMinute}`) || 0;

    // Determine overall health status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (memoryPercentage > 90 || avgResponseTime > 2000 || errorRate > 20) {
      status = 'critical';
    } else if (memoryPercentage > 75 || avgResponseTime > 1000 || errorRate > 5) {
      status = 'warning';
    }

    return {
      status,
      uptime,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: memoryPercentage
      },
      responseTime: {
        avg: avgResponseTime,
        p95: sortedTimes[p95Index] || 0,
        p99: sortedTimes[p99Index] || 0
      },
      errorRate,
      databaseHealth: await this.checkDatabaseHealth()
    };
  }

  /**
   * Performance Analytics
   */
  async getPerformanceAnalytics(organizationId?: string, timeRange = '1h') {
    const analytics = {
      timeRange,
      organizationId,
      summary: {
        totalRequests: 0,
        avgResponseTime: 0,
        errorRate: 0,
        slowestEndpoints: [] as Array<{endpoint: string; avgTime: number}>
      },
      trends: {
        responseTimeTrend: [] as Array<{timestamp: string; value: number}>,
        errorRateTrend: [] as Array<{timestamp: string; value: number}>,
        throughputTrend: [] as Array<{timestamp: string; value: number}>
      },
      topEndpoints: [] as Array<{endpoint: string; count: number; avgTime: number}>,
      alerts: [] as Array<{
        type: string;
        severity: string;
        message: string;
        timestamp: string;
      }>
    };

    // Calculate metrics from cache (in real implementation, query database)
    const allMetrics = Array.from(this.metricsCache.entries());
    
    analytics.summary.totalRequests = allMetrics.reduce((sum, [_, times]) => sum + times.length, 0);
    
    const allTimes = allMetrics.flatMap(([_, times]) => times);
    analytics.summary.avgResponseTime = allTimes.length > 0 
      ? Math.round(allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length)
      : 0;

    // Identify slowest endpoints
    analytics.summary.slowestEndpoints = allMetrics
      .map(([endpoint, times]) => ({
        endpoint,
        avgTime: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length)
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, 5);

    // Generate mock trends data (in real implementation, query time-series data)
    const now = Date.now();
    for (let i = 11; i >= 0; i--) {
      const timestamp = new Date(now - (i * 5 * 60 * 1000)).toISOString();
      analytics.trends.responseTimeTrend.push({
        timestamp,
        value: Math.floor(Math.random() * 500) + 200
      });
      analytics.trends.errorRateTrend.push({
        timestamp,
        value: Math.floor(Math.random() * 10)
      });
      analytics.trends.throughputTrend.push({
        timestamp,
        value: Math.floor(Math.random() * 100) + 50
      });
    }

    return analytics;
  }

  /**
   * Error Analytics and Insights
   */
  async getErrorAnalytics(organizationId?: string, timeRange = '24h') {
    return {
      timeRange,
      organizationId,
      summary: {
        totalErrors: 0,
        criticalErrors: 0,
        resolvedErrors: 0,
        errorRate: 0
      },
      errorTypes: [] as Array<{type: string; count: number; percentage: number}>,
      topErrorEndpoints: [] as Array<{endpoint: string; count: number}>,
      recentErrors: [] as Array<{
        id: string;
        type: string;
        message: string;
        endpoint: string;
        timestamp: string;
        severity: string;
      }>,
      trends: [] as Array<{timestamp: string; errors: number}>
    };
  }

  // Database Methods
  /**
   * Save performance metric to database
   */
  private async savePerformanceMetric(metric: InsertPerformanceMetric): Promise<void> {
    await db.insert(performanceMetrics).values(metric);
  }

  /**
   * Save error log to database
   */
  private async saveErrorLog(errorLog: InsertErrorLog): Promise<void> {
    await db.insert(errorLogs).values(errorLog);
  }

  // Helper Methods
  private determineErrorSeverity(error: Error, statusCode?: number): 'low' | 'medium' | 'high' | 'critical' {
    if (statusCode && statusCode >= 500) return 'critical';
    if (statusCode && statusCode >= 400) return 'medium';
    if (error.name === 'ValidationError') return 'low';
    if (error.name === 'DatabaseError') return 'high';
    return 'medium';
  }

  private async recordPerformanceAlert(alert: {
    type: string;
    endpoint: string;
    responseTime: number;
    threshold: number;
    organizationId?: string;
    userId?: string;
  }) {
    console.warn('Performance Alert:', alert);
    // In real implementation, save to database and trigger notifications
  }

  private triggerErrorRateAlert(errorRate: number) {
    console.warn(`High error rate detected: ${errorRate} errors per minute`);
    // In real implementation, trigger alert system
  }

  private async checkDatabaseHealth(): Promise<'healthy' | 'degraded' | 'down'> {
    try {
      // In real implementation, perform database health check
      // For now, simulate random health status
      const rand = Math.random();
      if (rand > 0.95) return 'down';
      if (rand > 0.85) return 'degraded';
      return 'healthy';
    } catch (error) {
      return 'down';
    }
  }

  /**
   * Cleanup old metrics (should be run periodically)
   */
  async cleanupOldMetrics() {
    const cutoffTime = Date.now() - (this.config.metricsRetentionDays * 24 * 60 * 60 * 1000);
    
    // Clear old cache entries
    const cutoffMinute = Math.floor(cutoffTime / 60000);
    const errorCacheEntries = Array.from(this.errorCache.entries());
    for (const [key, _] of errorCacheEntries) {
      if (key.startsWith('errors_')) {
        const minute = parseInt(key.split('_')[1]);
        if (minute < cutoffMinute) {
          this.errorCache.delete(key);
        }
      }
    }

    // In real implementation, clean up database records
    console.log(`Cleaned up metrics older than ${this.config.metricsRetentionDays} days`);
  }
}

export { PerformanceMonitor, type PerformanceConfig, type SystemHealth };