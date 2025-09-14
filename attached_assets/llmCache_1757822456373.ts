// backend/utils/llmCache.ts
type Entry = { value: any; exp: number };
const cache = new Map<string, Entry>();

export async function getOrSet<T>(key: string, ttlMs: number, producer: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const found = cache.get(key);
  if (found && found.exp > now) return found.value;
  const val = await producer();
  cache.set(key, { value: val, exp: now + ttlMs });
  return val;
}

export function makeKey(parts: Record<string, any>) {
  return Buffer.from(JSON.stringify(parts)).toString('base64url');
}
