import { redis } from "@/lib/redis";

interface RateLimitResult {
  success: boolean;
  remaining: number;
  limit: number;
}

/**
 * Fixed-window rate limiter backed by Redis. Used to protect public write
 * endpoints (contact form, favorites migration, Axel webhook) from abuse.
 */
export async function rateLimit(
  identifier: string,
  limit = 20,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }
    return { success: count <= limit, remaining: Math.max(0, limit - count), limit };
  } catch {
    // fail-open: if Redis is unavailable, do not block traffic
    return { success: true, remaining: limit, limit };
  }
}

export function identifierFromRequest(request: Request, scope: string): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
  return `${scope}:${ip}`;
}
