// backend/routes/billing/depth.ts
import { Router } from 'express';
const r = Router();

r.post('/billing/proration/preview', (req, res) => {
  const { currentPlan='pro', newPlan='enterprise', seats=5, daysRemaining=15 } = req.body || {};
  // Mock delta calculation
  const priceTable: any = { pro: 49, enterprise: 99 };
  const delta = ((priceTable[newPlan]-priceTable[currentPlan]) * seats) * (daysRemaining/30);
  res.json({ currentPlan, newPlan, seats, daysRemaining, prorationDelta: Math.round(delta*100)/100 });
});

r.post('/billing/dunning/simulate', (req, res) => {
  const { orgId='demo-org', invoiceId='inv_123', daysPastDue=3 } = req.body || {};
  res.json({ ok:true, orgId, invoiceId, daysPastDue, nextAction: daysPastDue >= Number(process.env.DUNNING_GRACE_DAYS||7) ? 'suspend' : 'remind' });
});

r.get('/billing/portal', (_req, res) => {
  res.json({ url: (process.env.BILLING_PUBLIC_URL||'') + '/mock-invoice-portal' });
});

export default r;
