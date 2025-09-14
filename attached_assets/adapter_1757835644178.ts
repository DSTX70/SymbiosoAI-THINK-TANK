import { Request, Response, NextFunction } from 'express';

/** Gate demo routes in staging/production */
export function demoGate(req: Request, res: Response, next: NextFunction) {
  const enabled = String(process.env.DEMO_LOGIN_ENABLED || 'false') === 'true';
  if (!enabled && req.path.startsWith('/auth/demo')) {
    return res.status(403).json({ error: 'DEMO_DISABLED' });
  }
  next();
}
