// backend/workers/dunningWorker.ts
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || '');
export const dunningQueue = new Queue('billing-dunning', { connection });

export function startDunningWorker(){
  const w = new Worker('billing-dunning', async (job) => {
    const { orgId, invoiceId, daysPastDue } = job.data || {};
    console.log('[dunning]', orgId, invoiceId, daysPastDue, '→ notify');
    // TODO: send email/notification; suspend features at final step
  }, { connection });
  w.on('failed', (_j,e)=>console.error('[dunning failed]', e?.message));
  return w;
}
