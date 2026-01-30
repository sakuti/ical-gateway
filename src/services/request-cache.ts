interface CacheEntry {
  icsContent: string;
  fetchedAt: number; // timestamp in ms
}

const cache = new Map<string, CacheEntry>();

/**
 * Get cached ICS if not stale, else return null
 * @param subscriptionId 
 * @param ttlMs Time to live in milliseconds
 */
export function getCachedIcs(subscriptionId: string, ttlMs: number = 5 * 60 * 1000): string | null {
  const entry = cache.get(subscriptionId);
  if (!entry) return null;

  if (Date.now() - entry.fetchedAt > ttlMs) {
    cache.delete(subscriptionId); // stale
    return null;
  }

  return entry.icsContent;
}

/** Set cache for a subscription */
export function setCachedIcs(subscriptionId: string, icsContent: string) {
  cache.set(subscriptionId, { icsContent, fetchedAt: Date.now() });
}
