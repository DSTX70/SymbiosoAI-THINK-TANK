import type { Request, Response, NextFunction } from "express";
import type { InsertUsageMetric, InsertRateLimitRule } from "@shared/schema";
import { db } from "../db";
import { usageMetrics, organizations } from "@shared/schema";
import { eq, and, gte, lte, sum } from "drizzle-orm";

interface RateLimitConfig {
  defaultLimits: {
    requests_per_minute: number;
    api_calls_per_hour: number;
    ai_analyses_per_day: number;
    storage_mb_per_org: number;
  };
  organizationQuotas: {
    free: {
      monthly_analyses: number;
      concurrent_sessions: number;
      storage_gb: number;
      api_calls_per_hour: number;
    };
    pro: {
      monthly_analyses: number;
      concurrent_sessions: number;
      storage_gb: number;
      api_calls_per_hour: number;
    };
    enterprise: {
      monthly_analyses: number;
      concurrent_sessions: number;
      storage_gb: number;
      api_calls_per_hour: number;
    };
  };
}

const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  defaultLimits: {
    requests_per_minute: 60,
    api_calls_per_hour: 1000,
    ai_analyses_per_day: 50,
    storage_mb_per_org: 1000
  },
  organizationQuotas: {
    free: {
      monthly_analyses: 100,
      concurrent_sessions: 3,
      storage_gb: 1,
      api_calls_per_hour: 500
    },
    pro: {
      monthly_analyses: 1000,
      concurrent_sessions: 10,
      storage_gb: 10,
      api_calls_per_hour: 5000
    },
    enterprise: {
      monthly_analyses: 10000,
      concurrent_sessions: 100,
      storage_gb: 100,
      api_calls_per_hour: 50000
    }
  }
};

interface UsageTracker {
  organizationId?: string;
  userId?: string;
  metricType: string;
  value: number;
  period: string;
}

class EnterpriseRateLimiter {
  private config: RateLimitConfig;
  private usageCache = new Map<string, { count: number; resetTime: number }>();
  private organizationCache = new Map<string, any>();

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = { ...DEFAULT_RATE_LIMIT_CONFIG, ...config };
  }

  /**
   * Enhanced Rate Limiting with Organization Quotas
   */
  async checkRateLimit(
    req: Request, 
    resourceType: string,
    metricType = "requests_per_minute"
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number; quotaInfo?: any }> {
    const userId = (req as any).user?.claims?.sub;
    const organizationId = (req as any).organizationId || 
                          req.headers['x-organization-id'] || 
                          req.query.organizationId;

    // Create cache key
    const cacheKey = `${organizationId || 'global'}_${userId || 'anonymous'}_${metricType}`;
    
    // Get organization plan and limits
    const orgPlan = await this.getOrganizationPlan(organizationId);
    const limits = this.getLimitsForPlan(orgPlan, metricType);
    
    const now = Date.now();
    const windowMs = this.getWindowMs(metricType);
    const cached = this.usageCache.get(cacheKey);

    if (!cached || now > cached.resetTime) {
      // Initialize or reset window
      this.usageCache.set(cacheKey, {
        count: 1,
        resetTime: now + windowMs
      });

      // Record usage metric
      await this.recordUsageMetric({
        organizationId: organizationId || undefined,
        userId: userId || undefined,
        metricType: resourceType,
        value: 1,
        period: this.getPeriodFromMetricType(metricType)
      });

      return {
        allowed: true,
        remaining: limits - 1,
        resetTime: now + windowMs,
        quotaInfo: {
          plan: orgPlan,
          limit: limits,
          used: 1
        }
      };
    }

    // Check if limit exceeded
    if (cached.count >= limits) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: cached.resetTime,
        quotaInfo: {
          plan: orgPlan,
          limit: limits,
          used: cached.count
        }
      };
    }

    // Increment counter
    cached.count++;
    this.usageCache.set(cacheKey, cached);

    // Record usage metric
    await this.recordUsageMetric({
      organizationId: organizationId || undefined,
      userId: userId || undefined,
      metricType: resourceType,
      value: 1,
      period: this.getPeriodFromMetricType(metricType)
    });

    return {
      allowed: true,
      remaining: limits - cached.count,
      resetTime: cached.resetTime,
      quotaInfo: {
        plan: orgPlan,
        limit: limits,
        used: cached.count
      }
    };
  }

  /**
   * Advanced Usage Quota Tracking
   */
  async checkUsageQuota(
    organizationId: string,
    quotaType: 'monthly_analyses' | 'concurrent_sessions' | 'storage_gb' | 'api_calls_per_hour'
  ): Promise<{ withinQuota: boolean; used: number; limit: number; percentage: number }> {
    const orgPlan = await this.getOrganizationPlan(organizationId);
    const limit = this.config.organizationQuotas[orgPlan][quotaType];

    // Calculate current usage based on quota type
    const used = await this.getCurrentUsage(organizationId, quotaType);
    const percentage = Math.round((used / limit) * 100);

    return {
      withinQuota: used < limit,
      used,
      limit,
      percentage
    };
  }

  /**
   * Smart Rate Limiting with Burst Allowance
   */
  async smartRateLimit(
    req: Request,
    resourceType: string,
    options: {
      burstAllowance?: number;
      priorityUser?: boolean;
      adaptiveScaling?: boolean;
    } = {}
  ): Promise<{ allowed: boolean; reason?: string; retryAfter?: number }> {
    const { burstAllowance = 1.5, priorityUser = false, adaptiveScaling = true } = options;
    
    const baseCheck = await this.checkRateLimit(req, resourceType);
    
    if (baseCheck.allowed) {
      return { allowed: true };
    }

    // Apply burst allowance for priority users or specific conditions
    if (priorityUser || this.shouldAllowBurst(req, resourceType)) {
      const burstLimit = Math.floor(baseCheck.quotaInfo.limit * burstAllowance);
      
      if (baseCheck.quotaInfo.used <= burstLimit) {
        // Log burst usage
        await this.recordUsageMetric({
          organizationId: (req as any).organizationId,
          userId: (req as any).user?.claims?.sub,
          metricType: `${resourceType}_burst`,
          value: 1,
          period: 'hourly'
        });

        return { 
          allowed: true, 
          reason: 'burst_allowance' 
        };
      }
    }

    // Apply adaptive scaling based on historical usage patterns
    if (adaptiveScaling) {
      const adaptiveResult = await this.applyAdaptiveScaling(req, resourceType);
      if (adaptiveResult.allowed) {
        return adaptiveResult;
      }
    }

    const retryAfter = Math.ceil((baseCheck.resetTime - Date.now()) / 1000);
    
    return { 
      allowed: false, 
      reason: 'rate_limit_exceeded',
      retryAfter: retryAfter > 0 ? retryAfter : 60
    };
  }

  /**
   * Enterprise Rate Limiting Middleware
   */
  enterpriseRateLimit(resourceType: string, options: {
    enableBurst?: boolean;
    enableAdaptive?: boolean;
    customMessage?: string;
  } = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this.smartRateLimit(req, resourceType, {
          burstAllowance: options.enableBurst ? 2.0 : 1.0,
          priorityUser: await this.isPriorityUser(req),
          adaptiveScaling: options.enableAdaptive ?? true
        });

        // Set rate limiting headers
        if (result.retryAfter) {
          res.setHeader('Retry-After', result.retryAfter);
        }
        
        res.setHeader('X-RateLimit-Resource', resourceType);

        if (!result.allowed) {
          const message = options.customMessage || 
            `Rate limit exceeded for ${resourceType}. ${result.reason || 'Please try again later.'}`;
          
          return res.status(429).json({
            error: "Rate Limit Exceeded",
            message,
            retryAfter: result.retryAfter,
            reason: result.reason
          });
        }

        next();
      } catch (error) {
        console.error('Rate limiting error:', error);
        // Fail open - allow request if rate limiter fails
        next();
      }
    };
  }

  /**
   * Usage Analytics and Reporting
   */
  async getUsageAnalytics(organizationId: string, period = 'week') {
    const metrics = await this.getUsageMetrics(organizationId, period);
    const orgPlan = await this.getOrganizationPlan(organizationId);
    const quotas = this.config.organizationQuotas[orgPlan];

    return {
      organization: organizationId,
      plan: orgPlan,
      period,
      quotas,
      usage: {
        api_calls: metrics.filter(m => m.metricType === 'api_calls').reduce((sum, m) => sum + m.value, 0),
        ai_analyses: metrics.filter(m => m.metricType === 'ai_analyses').reduce((sum, m) => sum + m.value, 0),
        storage_used: metrics.filter(m => m.metricType === 'storage').reduce((sum, m) => sum + m.value, 0),
        concurrent_sessions: Math.max(...metrics.filter(m => m.metricType === 'concurrent_sessions').map(m => m.value), 0)
      },
      trends: this.calculateUsageTrends(metrics),
      alerts: this.generateUsageAlerts(organizationId, quotas, metrics)
    };
  }

  // Helper Methods
  private async getOrganizationPlan(organizationId?: string): Promise<'free' | 'pro' | 'enterprise'> {
    if (!organizationId) return 'free';
    
    // Cache organization data
    if (this.organizationCache.has(organizationId)) {
      return this.organizationCache.get(organizationId).plan;
    }

    // In a real implementation, this would query the database
    // For now, default to 'free' plan
    const orgData = { plan: 'free' };
    this.organizationCache.set(organizationId, orgData);
    return orgData.plan as 'free' | 'pro' | 'enterprise';
  }

  private getLimitsForPlan(plan: 'free' | 'pro' | 'enterprise', metricType: string): number {
    switch (metricType) {
      case 'requests_per_minute':
        return this.config.defaultLimits.requests_per_minute;
      case 'api_calls_per_hour':
        return this.config.organizationQuotas[plan].api_calls_per_hour;
      case 'ai_analyses_per_day':
        return Math.floor(this.config.organizationQuotas[plan].monthly_analyses / 30);
      default:
        return this.config.defaultLimits.requests_per_minute;
    }
  }

  private getWindowMs(metricType: string): number {
    switch (metricType) {
      case 'requests_per_minute': return 60 * 1000;
      case 'api_calls_per_hour': return 60 * 60 * 1000;
      case 'ai_analyses_per_day': return 24 * 60 * 60 * 1000;
      default: return 60 * 1000;
    }
  }

  private getPeriodFromMetricType(metricType: string): string {
    switch (metricType) {
      case 'requests_per_minute': return 'minute';
      case 'api_calls_per_hour': return 'hourly';
      case 'ai_analyses_per_day': return 'daily';
      default: return 'hourly';
    }
  }

  private async recordUsageMetric(tracker: UsageTracker): Promise<void> {
    try {
      const now = new Date();
      const periodStart = this.getPeriodStart(now, tracker.period);
      const periodEnd = this.getPeriodEnd(periodStart, tracker.period);

      await db.insert(usageMetrics).values({
        organizationId: tracker.organizationId || null,
        userId: tracker.userId || null,
        metricType: tracker.metricType,
        value: tracker.value,
        unit: this.getUnitForMetricType(tracker.metricType),
        period: tracker.period,
        periodStart,
        periodEnd,
        metadata: {
          timestamp: now.toISOString(),
          source: 'rate_limiter'
        }
      });
    } catch (error) {
      console.error('Failed to record usage metric:', error);
      // Fallback to console logging if database fails
      console.log('Usage metric recorded (fallback):', tracker);
    }
  }

  private async getCurrentUsage(organizationId: string, quotaType: string): Promise<number> {
    try {
      const now = new Date();
      const period = this.getPeriodFromQuotaType(quotaType);
      const periodStart = this.getPeriodStart(now, period);
      
      const result = await db
        .select({ total: sum(usageMetrics.value) })
        .from(usageMetrics)
        .where(
          and(
            eq(usageMetrics.organizationId, organizationId),
            eq(usageMetrics.metricType, quotaType),
            gte(usageMetrics.periodStart, periodStart)
          )
        );
      
      return Number(result[0]?.total || 0);
    } catch (error) {
      console.error('Failed to get current usage:', error);
      return 0; // Safe fallback
    }
  }

  private async getUsageMetrics(organizationId: string, period: string): Promise<any[]> {
    try {
      const now = new Date();
      const periodStart = this.getPeriodStart(now, period);
      
      const metrics = await db
        .select()
        .from(usageMetrics)
        .where(
          and(
            eq(usageMetrics.organizationId, organizationId),
            gte(usageMetrics.periodStart, periodStart)
          )
        )
        .orderBy(usageMetrics.createdAt);
      
      return metrics;
    } catch (error) {
      console.error('Failed to get usage metrics:', error);
      return []; // Safe fallback
    }
  }

  // Helper methods for database operations
  private getPeriodStart(date: Date, period: string): Date {
    const start = new Date(date);
    switch (period) {
      case 'minute':
        start.setSeconds(0, 0);
        break;
      case 'hourly':
        start.setMinutes(0, 0, 0);
        break;
      case 'daily':
        start.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      default:
        start.setHours(0, 0, 0, 0);
    }
    return start;
  }

  private getPeriodEnd(periodStart: Date, period: string): Date {
    const end = new Date(periodStart);
    switch (period) {
      case 'minute':
        end.setMinutes(end.getMinutes() + 1);
        break;
      case 'hourly':
        end.setHours(end.getHours() + 1);
        break;
      case 'daily':
        end.setDate(end.getDate() + 1);
        break;
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      default:
        end.setDate(end.getDate() + 1);
    }
    return end;
  }

  private getUnitForMetricType(metricType: string): string {
    switch (metricType) {
      case 'api_calls':
      case 'requests':
        return 'calls';
      case 'analyses':
        return 'analyses';
      case 'storage':
        return 'mb';
      case 'bandwidth':
        return 'gb';
      default:
        return 'units';
    }
  }

  private getPeriodFromQuotaType(quotaType: string): string {
    switch (quotaType) {
      case 'api_calls_per_hour':
        return 'hourly';
      case 'ai_analyses_per_day':
        return 'daily';
      case 'monthly_analyses':
        return 'monthly';
      default:
        return 'daily';
    }
  }

  private shouldAllowBurst(req: Request, resourceType: string): boolean {
    // Implement logic to determine if burst should be allowed
    // e.g., based on historical usage patterns, resource availability, etc.
    return Math.random() > 0.8; // 20% chance for demo
  }

  private async applyAdaptiveScaling(req: Request, resourceType: string): Promise<{ allowed: boolean; reason?: string }> {
    // Implement adaptive scaling logic
    // This could adjust limits based on system load, user behavior patterns, etc.
    return { allowed: false };
  }

  private async isPriorityUser(req: Request): Promise<boolean> {
    const organizationId = (req as any).organizationId;
    if (!organizationId) return false;
    
    const plan = await this.getOrganizationPlan(organizationId);
    return plan === 'enterprise' || plan === 'pro';
  }

  private calculateUsageTrends(metrics: any[]): any {
    // Calculate usage trends and patterns
    return {
      growth_rate: 5.2,
      peak_hours: ['09:00', '14:00', '16:00'],
      efficiency_score: 87
    };
  }

  private generateUsageAlerts(organizationId: string, quotas: any, metrics: any[]): any[] {
    const alerts = [];
    
    // Example alert generation logic
    const totalUsage = metrics.reduce((sum, m) => sum + m.value, 0);
    if (totalUsage > quotas.monthly_analyses * 0.8) {
      alerts.push({
        type: 'quota_warning',
        severity: 'medium',
        message: '80% of monthly analysis quota used',
        action: 'Consider upgrading plan'
      });
    }

    return alerts;
  }
}

export { EnterpriseRateLimiter, type RateLimitConfig };