import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { ResponseCache } from "./middleware/responseCache";
import { PerformanceMonitor } from "./middleware/monitoring";

// Set BYPASS_AUTH for development testing
if (process.env.NODE_ENV === 'development') {
  process.env.BYPASS_AUTH = 'true';
  console.log('🔓 Auth bypass enabled for development testing');
}

const app = express();
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
  const server = await registerRoutes(app);

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
