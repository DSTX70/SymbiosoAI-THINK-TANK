import type { Express, Request, Response } from 'express';

export function registerHealth(app: Express) {
  app.get('/health', (_req: Request, res: Response) => res.status(200).json({ ok: true }));
}