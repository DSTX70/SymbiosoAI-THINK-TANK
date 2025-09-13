import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { ResponseCache } from "./middleware/responseCache";
import { PerformanceMonitor } from "./middleware/monitoring";
import helmet from "helmet";
import { demoGate } from "./middleware/auth";
import { startDebateWorker } from "./queue/queue";
import debatesAsyncRouter from "./routes/debates-async";
import exportRouter from "./routes/export";
// Sprint 2: New API routes
import pushRouter from "./routes/push";
import webhooksRouter from "./routes/webhooks";
import templatesRouter from "./routes/templates";
// Sprint 2: Webhook delivery and observability
import { startWebhookWorker } from "./services/webhookDelivery";
import { initObservability } from "./services/observability";

// Set BYPASS_AUTH for development testing - commented out to show login flow
// if (process.env.NODE_ENV === 'development') {
//   process.env.BYPASS_AUTH = 'true';
//   console.log('🔓 Auth bypass enabled for development testing');
// }

const app = express();

// Sprint 1: Security headers and demo gate
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));
app.use(demoGate);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize performance monitoring and caching
const responseCache = new ResponseCache({
  defaultTTL: 300, // 5 minutes
  maxSize: 1000,
  excludeRoutes: ['/api/auth', '/api/think', '/api/admin'] // Don't cache sensitive endpoints
});

const performanceMonitor = new PerformanceMonitor({
  enableMetrics: true,
  enableErrorTracking: true,
  slowQueryThreshold: 2000, // Alert on responses > 2s
  errorAlertThreshold: 10
});

// Apply middleware
app.use(responseCache.middleware());
app.use(performanceMonitor.performanceMiddleware());
app.use(performanceMonitor.errorTrackingMiddleware());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Sprint 2: Initialize observability monitoring first
  console.log("🚀 Starting Sprint 2 infrastructure...");
  initObservability();
  
  // Sprint 1: Start the debate worker
  console.log("🚀 Starting Sprint 1 features...");
  startDebateWorker();
  
  // Sprint 2: Start the webhook delivery worker
  await startWebhookWorker();
  
  // Register main routes first (includes session setup)
  const server = await registerRoutes(app);
  
  // Mount Sprint 1 routes AFTER session setup
  app.use('/api', debatesAsyncRouter);
  app.use('/api', exportRouter);
  
  // Mount Sprint 2 routes
  app.use('/api', pushRouter);
  app.use('/api', webhooksRouter);
  app.use('/api', templatesRouter);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
