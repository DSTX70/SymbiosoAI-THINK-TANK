import { Request, Response, NextFunction } from 'express';

/**
 * DEMO gate: disable demo login in production
 */
export function demoGate(req: Request, res: Response, next: NextFunction) {
  const enabled = String(process.env.DEMO_LOGIN_ENABLED || 'true') === 'true';
  if (!enabled && req.path.startsWith('/auth/demo')) {
    return res.status(403).json({ error: 'DEMO_DISABLED' });
  }
  next();
}

/**
 * Enhanced authentication middleware that works with both session and token auth
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Check existing auth from our current system
    if ((req as any).user || (req as any).session?.user) {
      return next();
    }
    
    return res.status(401).json({ error: 'UNAUTHENTICATED' });
  } catch (error) {
    return res.status(401).json({ error: 'UNAUTHENTICATED' });
  }
}