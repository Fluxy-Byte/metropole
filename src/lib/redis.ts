import Redis from "ioredis";

declare global {
  var redisGlobal: Redis | undefined;
}

function createRedisClient() {
  return new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    lazyConnect: false,
  });
}

export const redis = globalThis.redisGlobal ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.redisGlobal = redis;
}

const DEFAULT_TTL_SECONDS = 60 * 5;

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number = DEFAULT_TTL_SECONDS,
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // cache is best-effort; ignore failures
  }
}

export async function cacheDel(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {
    // ignore
  }
}

/**
 * Deletes every key matching a prefix. Used to invalidate list/collection caches
 * (e.g. "houses:list:*") after a create/update/delete on the underlying entity.
 */
export async function cacheDelByPrefix(prefix: string): Promise<void> {
  try {
    const stream = redis.scanStream({ match: `${prefix}*`, count: 100 });
    const keysToDelete: string[] = [];
    for await (const keys of stream) {
      keysToDelete.push(...(keys as string[]));
    }
    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
    }
  } catch {
    // ignore
  }
}

export async function cacheWrap<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;
  const fresh = await loader();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}

export const CACHE_KEYS = {
  housesList: (paramsHash: string) => `houses:list:${paramsHash}`,
  housesListPrefix: "houses:list:",
  houseDetail: (id: string) => `houses:detail:${id}`,
  houseDetailPrefix: "houses:detail:",
  categories: "categories:all",
  dashboard: (paramsHash: string) => `dashboard:${paramsHash}`,
  dashboardPrefix: "dashboard:",
  clientsList: (paramsHash: string) => `clients:list:${paramsHash}`,
  clientsListPrefix: "clients:list:",
  clientDetail: (id: string) => `clients:detail:${id}`,
  clientDetailPrefix: "clients:detail:",
} as const;
