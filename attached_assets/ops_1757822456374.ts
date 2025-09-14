// backend/routes/ops/ops.ts
import { Router } from 'express';
const r = Router();

r.get('/ops/health', (_req, res) => {
  res.json({ ok:true, uptime_s: process.uptime(), ts: Date.now(), queues: { debate: 'unknown', workflow: 'unknown' } });
});

r.post('/ops/echo', (req, res) => {
  res.json({ ok:true, received: req.body || {} });
});

export default r;
