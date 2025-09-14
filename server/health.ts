import type { Express, Request, Response } from 'express';

/**
 * Minimal health endpoint.
 * Why: CI/Newman waits on /health for readiness; also useful for uptime checks.
 */
export function registerHealth(app: Express) {
  app.get('/health', (_req: Request, res: Response) => res.status(200).json({ ok: true }));
}