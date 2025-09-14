// backend/routes/admin/admin.ts
import { Router } from 'express';
const r = Router();

r.get('/admin/sla', (_req, res) => {
  res.json({ debate_p95_ms: Number(process.env.SLA_DEBATE_P95_MS||30000), export_p95_ms: Number(process.env.SLA_EXPORT_P95_MS||5000) });
});

r.get('/admin/a11y/quickcheck', (_req, res) => {
  res.json({ checks: (process.env.A11Y_CHECKS||'aria,contrast,keyboard').split(',') , result: 'pending (manual/CI)' });
});

export default r;
