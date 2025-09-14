// backend/middleware/entitlementGuard.ts
import { Request, Response, NextFunction } from 'express';

// Very simple org feature map (replace with DB lookups)
const features: Record<string, Set<string>> = {
  'demo-org': new Set(['guided','expert','marketplace.risk-review'])
};

export function requireEntitlement(feature: string){
  return (req: Request, res: Response, next: NextFunction) => {
    const orgId = (req as any).orgId || 'demo-org';
    const ok = features[orgId]?.has(feature);
    if (!ok) return res.status(403).json({ ok:false, code:'ENTITLEMENT_REQUIRED', feature });
    next();
  };
}
