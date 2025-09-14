// backend/routes/entitlements/check.ts
import { Router } from 'express';
const r = Router();

r.get('/entitlements/check', (req, res) => {
  const orgId = (req as any).orgId || 'demo-org';
  // Mock payload
  res.json({ orgId, features: ['guided','expert','marketplace.risk-review'] });
});

export default r;
