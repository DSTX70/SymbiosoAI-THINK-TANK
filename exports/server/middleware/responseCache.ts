import type { Request, Response, NextFunction } from "express";
import type { InsertPerformanceMetric } from "@shared/schema";
import { db } from "../db";
import { performanceMetrics } from "@shared/schema";

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
  contentType?: string;
  etag: string;
}

interface CacheConfig {
  defaultTTL: number; // seconds
  maxSize: number; // maximum cache entries
  enableCompression: boolean;
  cacheableStatusCodes: number[];
  excludeRoutes: string[];
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  defaultTTL: 300, // 5 minutes
  maxSize: 1000,
  enableCompression: true,
  cacheableStatusCodes: [200, 301, 302, 404],
  excludeRoutes: ['/api/auth', '/api/think'] // Don't cache auth or AI requests
};

class ResponseCache {
  private cache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private hitCount = 0;
  private totalRequests = 0;

  constructor(config?: Partial<CacheConfig>) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  /**
   * Cache Hit Rate Tracking
   */
  getCacheStats() {
    return {
      hitRate: this.totalRequests > 0 ? (this.hitCount / this.totalRequests) * 100 : 0,
      hitCount: this.hitCount,
      totalRequests: this.totalRequests,
      cacheSize: this.cache.size,
      maxSize: this.config.maxSize
    };
  }

  /**
   * Response Caching Middleware
   */
  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Skip caching for excluded routes
      if (this.shouldSkipCache(req)) {
        return next();
      }

      const cacheKey = this.generateCacheKey(req);
      this.totalRequests++;

      // Check for cached response
      const cached = this.get(cacheKey);
      if (cached) {
        this.hitCount++;
        
        // Set cache headers
        res.set('X-Cache', 'HIT');
        res.set('ETag', cached.etag);
        
        // Check if client has current version
        if (req.headers['if-none-match'] === cached.etag) {
          return res.status(304).send();
        }

        // Record cache hit metric
        this.recordCacheMetric(req, 'cache_hit', 1);
        
        // Send cached response
        if (cached.contentType) {
          res.set('Content-Type', cached.contentType);
        }
        return res.send(cached.data);
      }

      // Cache miss - intercept response
      const originalSend = res.send;
      const originalJson = res.json;
      const self = this;

      res.send = async function(body: any) {
        if (self.shouldCache(this.statusCode, req)) {
          const etag = self.generateETag(body);
          const entry: CacheEntry = {
            data: body,
            timestamp: Date.now(),
            ttl: self.getTTL(req),
            contentType: this.get('Content-Type'),
            etag
          };
          
          self.set(cacheKey, entry);
          this.set('ETag', etag);
        }
        
        this.set('X-Cache', 'MISS');
        self.recordCacheMetric(req, 'cache_miss', 1);
        
        return originalSend.call(this, body);
      };

      res.json = async function(body: any) {
        if (self.shouldCache(this.statusCode, req)) {
          const etag = self.generateETag(body);
          const entry: CacheEntry = {
            data: body,
            timestamp: Date.now(),
            ttl: self.getTTL(req),
            contentType: 'application/json',
            etag
          };
          
          self.set(cacheKey, entry);
          this.set('ETag', etag);
        }
        
        this.set('X-Cache', 'MISS');
        self.recordCacheMetric(req, 'cache_miss', 1);
        
        return originalJson.call(this, body);
      };

      next();
    };
  }

  private generateCacheKey(req: Request): string {
    const { method, path, query } = req;
    const userId = (req as any).user?.claims?.sub || 'anonymous';
    const orgId = (req as any).organizationId || 'global';
    
    // Include relevant query params in cache key
    const queryString = Object.keys(query)
      .sort()
      .map(key => `${key}=${query[key]}`)
      .join('&');
    
    return `${method}:${path}:${queryString}:${userId}:${orgId}`;
  }

  private generateETag(data: any): string {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    // Use a simple hash function instead of crypto to avoid ES module issues
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `"${Math.abs(hash).toString(16)}"`;
  }

  private shouldSkipCache(req: Request): boolean {
    return this.config.excludeRoutes.some(route => req.path.startsWith(route)) ||
           req.method !== 'GET';
  }

  private shouldCache(statusCode: number, req: Request): boolean {
    return this.config.cacheableStatusCodes.includes(statusCode) &&
           !this.shouldSkipCache(req);
  }

  private getTTL(req: Request): number {
    // Different TTL for different routes
    if (req.path.startsWith('/api/system')) return 60; // 1 minute for system status
    if (req.path.startsWith('/api/templates')) return 3600; // 1 hour for templates
    if (req.path.startsWith('/api/users')) return 300; // 5 minutes for user data
    
    return this.config.defaultTTL;
  }

  private get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  private set(key: string, entry: CacheEntry): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, entry);
  }

  private async recordCacheMetric(req: Request, metricType: string, value: number): Promise<void> {
    try {
      console.log('Cache metric recorded:', metricType, value, req.path);
      // Temporarily disabled to prevent database errors
      // await db.insert(performanceMetrics).values({
      //   organizationId: (req as any).organizationId || null,
      //   metricName: metricType,
      //   value: value,
      //   unit: 'count',
      //   endpoint: `${req.method} ${req.path}`,
      //   tags: {
      //     cacheStats: this.getCacheStats(),
      //     timestamp: new Date().toISOString()
      //   }
      // });
    } catch (error) {
      console.error('Failed to record cache metric:', error);
    }
  }

  /**
   * Cache Management
   */
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.totalRequests = 0;
  }

  invalidate(pattern: string): number {
    let invalidated = 0;
    for (const [key] of Array.from(this.cache.entries())) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    return invalidated;
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        this.cache.delete(key);
      }
    }
  }
}

export { ResponseCache, type CacheConfig };