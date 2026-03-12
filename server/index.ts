import express, { type Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
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
import tutorialsRouter from "./routes/tutorials";
// Sprint 11: Billing API routes
import billingRouter from "./routes/billing";
import stripeRoutes from "./routes/stripe";
// Sprint 2: Webhook delivery and observability
import { startWebhookWorker } from "./services/webhookDelivery";
import { initObservability } from "./services/observability";
import { AppError } from "./utils/errors";

// Set BYPASS_AUTH for development testing - commented out to show login flow
// if (process.env.NODE_ENV === 'development') {
//   process.env.BYPASS_AUTH = 'true';
//   console.log('🔓 Auth bypass enabled for development testing');
// }

const app = express();

// Attach request ID for tracing
app.use((req, res, next) => {
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();
  (req as any).requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
});

// Standardize error envelopes for non-AppError responses
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    if (res.statusCode >= 400) {
      const requestId = (req as any).requestId;
      const alreadyEnvelope =
        body?.error &&
        typeof body.error === "object" &&
        body.error.code &&
        body.error.message &&
        body.error.type &&
        body.error.timestamp;
      if (!alreadyEnvelope) {
        const status = res.statusCode;
        const type =
          status === 400
            ? "validation"
            : status === 401
            ? "authentication"
            : status === 403
            ? "authorization"
            : status === 404
            ? "not_found"
            : status === 429
            ? "rate_limit"
            : "internal";
        const code =
          body?.error?.code ||
          body?.code ||
          (status === 400
            ? "INVALID_INPUT"
            : status === 401
            ? "INVALID_CREDENTIALS"
            : status === 403
            ? "ACCESS_DENIED"
            : status === 404
            ? "RESOURCE_NOT_FOUND"
            : status === 429
            ? "RATE_LIMIT_EXCEEDED"
            : "INTERNAL_SERVER_ERROR");
        const message =
          body?.error?.message ||
          body?.message ||
          body?.error ||
          res.statusMessage ||
          "Request failed";
        const details = body?.details || body?.error?.details;
        return originalJson({
          error: {
            code,
            message,
            type,
            details,
            requestId,
            timestamp: new Date().toISOString(),
          },
        });
      }
    }
    return originalJson(body);
  };
  next();
});

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
  
  // Start the export provenance worker
  const { startExportProvenanceWorker } = await import('./workers/exportProvenanceWorker');
  startExportProvenanceWorker();
  
  // Register main routes first (includes session setup)
  const server = await registerRoutes(app);
  
  // Mount Sprint 1 routes AFTER session setup
  app.use('/api', debatesAsyncRouter);
  app.use('/api', exportRouter);
  
  // Mount Sprint 2 routes
  app.use('/api', pushRouter);
  app.use('/api', webhooksRouter);

  // Mount integration routes (Slack, Jira)
  const slackRouter = (await import('./routes/slack')).default;
  const jiraRouter = (await import('./routes/jira')).default;
  app.use('/api/slack', slackRouter);
  app.use('/api/jira', jiraRouter);
  app.use('/api', templatesRouter);
  app.use('/api/tutorials', tutorialsRouter);
  
  // Mount Sprint 11 billing routes
  app.use('/api/billing', billingRouter);
  // Stripe routes available under consolidated billing namespace
  app.use('/api/billing/stripe', stripeRoutes);
  // Backward-compatible Stripe routes (deprecated)
  app.use('/api/stripe', (req, res, next) => {
    res.setHeader('X-Deprecated', 'Use /api/billing/stripe/* instead');
    next();
  }, stripeRoutes);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const requestId = (err?.requestId || (res as any).req?.requestId) ?? undefined;

    if (err instanceof AppError) {
      console.error(JSON.stringify({
        level: "error",
        message: err.message,
        status: err.statusCode,
        code: err.code,
        requestId,
        path: (res as any).req?.path,
        method: (res as any).req?.method,
      }));
      res.status(err.statusCode).json(err.toEnvelope(requestId));
      throw err;
    }

    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(JSON.stringify({
      level: "error",
      message,
      status,
      requestId,
      path: (res as any).req?.path,
      method: (res as any).req?.method,
    }));

    res.status(status).json({
      error: {
        code: err.code || "INTERNAL_ERROR",
        message,
        requestId,
      }
    });
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
    host: process.env.HOST || "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
