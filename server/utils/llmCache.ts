// Sprint 8 - TTL-based LLM response cache
type Entry = { value: any; exp: number; hits: number };
const cache = new Map<string, Entry>();

export async function getOrSet<T>(
  key: string, 
  ttlMs: number, 
  producer: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const found = cache.get(key);
  
  if (found && found.exp > now) {
    // Cache hit - increment hit counter
    found.hits += 1;
    return found.value;
  }
  
  // Cache miss - produce new value
  const val = await producer();
  cache.set(key, { value: val, exp: now + ttlMs, hits: 1 });
  
  // Clean expired entries periodically
  if (cache.size > 100) {
    cleanExpiredEntries();
  }
  
  return val;
}

export function makeKey(parts: Record<string, any>): string {
  return Buffer.from(JSON.stringify(parts)).toString('base64url');
}

export function getCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let totalHits = 0;
  let expiredEntries = 0;
  
  for (const [, entry] of Array.from(cache.entries())) {
    if (entry.exp > now) {
      validEntries++;
      totalHits += entry.hits;
    } else {
      expiredEntries++;
    }
  }
  
  return {
    totalEntries: cache.size,
    validEntries,
    expiredEntries,
    totalHits,
    hitRate: validEntries > 0 ? totalHits / validEntries : 0
  };
}

function cleanExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of Array.from(cache.entries())) {
    if (entry.exp <= now) {
      cache.delete(key);
    }
  }
}

// LLM cache helpers
export function makeLLMKey(prompt: string, mode: string, policy?: string): string {
  return makeKey({ 
    type: 'llm_response',
    prompt: prompt.trim(),
    mode,
    policy: policy || 'default'
  });
}

export async function getCachedLLMResponse<T>(
  prompt: string,
  mode: string,
  policy: string | undefined,
  producer: () => Promise<T>
): Promise<T> {
  const key = makeLLMKey(prompt, mode, policy);
  const ttlMs = Number(process.env.LLM_CACHE_TTL_MS || 300000); // 5 minutes default
  
  return getOrSet(key, ttlMs, producer);
}
