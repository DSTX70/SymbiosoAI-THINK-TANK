import { Request, Response, NextFunction } from 'express';

/** Enforce org header (optional for pilots) */
export function requireOrg(req: Request, res: Response, next: NextFunction) {
  const required = String(process.env.REQUIRE_ORG_HEADER || 'false') === 'true';
  const orgId = (req.header('X-Org-Id') || 'pilot-org').trim();
  if (required && !orgId) return res.status(400).json({ error: 'ORG_HEADER_REQUIRED' });
  (req as any).orgId = orgId;
  next();
}
