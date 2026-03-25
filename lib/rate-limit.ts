/**
 * Simple in-memory rate limiter for auth endpoints.
 *
 * NOTE: Like the user store, this is in-memory and therefore:
 *  - Resets on server restart.
 *  - Is NOT shared across serverless function instances.
 * For production use, replace with a Redis-backed solution (e.g. Upstash).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Prune expired entries every 5 minutes to prevent unbounded growth.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check and record a rate-limit hit for the given key.
 *
 * @param key       Identifier (e.g. IP address).
 * @param limit     Maximum number of requests allowed within the window.
 * @param windowMs  Window duration in milliseconds.
 * @returns `{ allowed: boolean; retryAfterSeconds: number }`.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}
