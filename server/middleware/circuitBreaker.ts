// Sprint 8 - Circuit Breaker Middleware for external API resilience
type State = 'closed' | 'open' | 'half-open';

export function circuitBreaker(opts?: { failureThreshold?: number; resetMs?: number }) {
  const failureThreshold = opts?.failureThreshold ?? Number(process.env.CB_FAILURE_THRESHOLD || 5);
  const resetMs = opts?.resetMs ?? Number(process.env.CB_RESET_MS || 15000);
  let state: State = 'closed';
  let fails = 0;
  let nextTry = 0;

  return async function <T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    if (state === 'open' && now < nextTry) throw new Error('CB_OPEN');
    if (state === 'open' && now >= nextTry) state = 'half-open';

    try {
      const result = await fn();
      fails = 0;
      state = 'closed';
      return result;
    } catch (e) {
      fails += 1;
      if (fails >= failureThreshold) {
        state = 'open';
        nextTry = now + resetMs;
      }
      throw e;
    }
  };
}

// Circuit breaker middleware factory for Express routes
export function createCircuitBreakerMiddleware(serviceName: string, opts?: { failureThreshold?: number; resetMs?: number }) {
  const cb = circuitBreaker(opts);
  
  return (req: any, res: any, next: any) => {
    // Store circuit breaker on request for use in route handlers
    req.circuitBreaker = cb;
    req.serviceName = serviceName;
    next();
  };
}