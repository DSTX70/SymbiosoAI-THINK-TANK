// backend/utils/withRetry.ts
export async function withRetry<T>(fn: () => Promise<T>, opts?: { attempts?: number; backoffMs?: number }) {
  const attempts = opts?.attempts ?? Number(process.env.RETRY_MAX_ATTEMPTS || 3);
  const backoffMs = opts?.backoffMs ?? Number(process.env.RETRY_BACKOFF_MS || 500);
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (e) { lastErr = e; await new Promise(r => setTimeout(r, backoffMs * (i + 1))); }
  }
  throw lastErr;
}
