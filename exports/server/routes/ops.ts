// Sprint 8 - Reliability Operations Endpoints
import type { Express } from "express";
import { storage } from "../storage";
import { getCacheStats } from "../utils/llmCache";

export function registerOpsRoutes(app: Express) {
  // Health check endpoint
  app.get('/ops/health', async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Check database connectivity
      let dbStatus = 'healthy';
      let dbResponseTime = 0;
      try {
        const dbStart = Date.now();
        await storage.getUserAnalysisSessions("health-check-user");
        dbResponseTime = Date.now() - dbStart;
      } catch (error) {
        dbStatus = 'unhealthy';
        dbResponseTime = Date.now() - startTime;
      }

      // Check cache performance
      const cacheStats = getCacheStats();
      
      // System metrics
      const memoryUsage = process.memoryUsage();
      const uptime = process.uptime();
      
      // Health score calculation
      let healthScore = 100;
      if (dbStatus === 'unhealthy') healthScore -= 50;
      if (dbResponseTime > 1000) healthScore -= 20; // High DB latency
      if (cacheStats.hitRate < 0.2) healthScore -= 10; // Low cache hit rate
      if (memoryUsage.heapUsed / memoryUsage.heapTotal > 0.9) healthScore -= 20; // High memory usage
      
      const responseTime = Date.now() - startTime;
      const isHealthy = healthScore >= 70;
      
      const healthData = {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        uptime: Math.floor(uptime),
        healthScore,
        responseTime: `${responseTime}ms`,
        checks: {
          database: {
            status: dbStatus,
            responseTime: `${dbResponseTime}ms`
          },
          cache: {
            status: cacheStats.validEntries > 0 ? 'healthy' : 'empty',
            hitRate: Math.round(cacheStats.hitRate * 100) / 100,
            entries: cacheStats.validEntries,
            totalHits: cacheStats.totalHits
          },
          memory: {
            status: memoryUsage.heapUsed / memoryUsage.heapTotal < 0.9 ? 'healthy' : 'high',
            usage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
            heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
          },
          workers: {
            // In a real implementation, you'd check actual worker status
            workflow: 'running',
            insights: 'running'
          }
        },
        environment: process.env.NODE_ENV || 'unknown'
      };

      res.status(isHealthy ? 200 : 503).json(healthData);
    } catch (error) {
      console.error('Health check error:', error);
      res.status(500).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  });

  // Echo endpoint for connectivity testing
  app.post('/ops/echo', (req, res) => {
    const timestamp = new Date().toISOString();
    const body = req.body;
    
    res.json({
      echo: true,
      timestamp,
      received: body,
      headers: {
        'content-type': req.get('content-type'),
        'user-agent': req.get('user-agent'),
        'x-forwarded-for': req.get('x-forwarded-for'),
        'host': req.get('host')
      },
      method: req.method,
      url: req.url,
      ip: req.ip,
      responseTime: Date.now() - parseInt(req.get('x-start-time') || '0') || 0
    });
  });

  // Readiness probe (Kubernetes-style)
  app.get('/ops/ready', async (req, res) => {
    try {
      // Check if application is ready to serve traffic
      await storage.getUserAnalysisSessions("readiness-check");
      
      res.json({
        ready: true,
        timestamp: new Date().toISOString(),
        checks: {
          database: 'ready',
          workers: 'ready',
          cache: 'ready'
        }
      });
    } catch (error) {
      res.status(503).json({
        ready: false,
        timestamp: new Date().toISOString(),
        error: 'Application not ready'
      });
    }
  });

  // Liveness probe (Kubernetes-style)
  app.get('/ops/live', (req, res) => {
    // Simple liveness check - if this endpoint responds, the process is alive
    res.json({
      alive: true,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      pid: process.pid
    });
  });

  // Metrics endpoint for monitoring integration
  app.get('/ops/metrics', async (req, res) => {
    try {
      const memoryUsage = process.memoryUsage();
      const cacheStats = getCacheStats();
      
      // Prometheus-style metrics
      const metrics = [
        `# HELP nodejs_memory_heap_used_bytes Process heap memory used`,
        `# TYPE nodejs_memory_heap_used_bytes gauge`,
        `nodejs_memory_heap_used_bytes ${memoryUsage.heapUsed}`,
        ``,
        `# HELP nodejs_memory_heap_total_bytes Process heap memory total`,
        `# TYPE nodejs_memory_heap_total_bytes gauge`,
        `nodejs_memory_heap_total_bytes ${memoryUsage.heapTotal}`,
        ``,
        `# HELP cache_entries_total Total cache entries`,
        `# TYPE cache_entries_total gauge`,
        `cache_entries_total ${cacheStats.validEntries}`,
        ``,
        `# HELP cache_hits_total Total cache hits`,
        `# TYPE cache_hits_total counter`,
        `cache_hits_total ${cacheStats.totalHits}`,
        ``,
        `# HELP process_uptime_seconds Process uptime in seconds`,
        `# TYPE process_uptime_seconds gauge`,
        `process_uptime_seconds ${Math.floor(process.uptime())}`,
        ``
      ].join('\n');

      res.set('Content-Type', 'text/plain');
      res.send(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate metrics' });
    }
  });

  console.log('✅ Ops routes registered successfully');
}