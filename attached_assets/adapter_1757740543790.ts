import { Request, Response, NextFunction } from 'express';

/**
 * DEMO gate: disable demo login in production
 */
export function demoGate(req: Request, res: Response, next: NextFunction) {
  const enabled = String(process.env.DEMO_LOGIN_ENABLED || 'false') === 'true';
  if (!enabled && req.path.startsWith('/auth/demo')) {
    return res.status(403).json({ error: 'DEMO_DISABLED' });
  }
  next();
}

/**
 * OIDC/SAML adapter scaffold
 * Implement your provider here (passport-openidconnect / custom library).
 * Expose routes like /auth/login, /auth/callback, and create a session.
 */
export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  // TODO: replace with your existing auth check
  if ((req as any).user) return next();
  return res.status(401).json({ error: 'UNAUTHENTICATED' });
}
