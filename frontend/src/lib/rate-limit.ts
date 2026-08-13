interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL = 60000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetTime) store.delete(key);
  }
}

export function rateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  cleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

export function getRateLimitKey(request: Request, prefix: string): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim();

  if (ip) {
    return `${prefix}:${ip}`;
  }

  // Sin cabeceras de IP: evitar un bucket compartido "127.0.0.1"
  // derivando una clave del User-Agent.
  const ua = request.headers.get("user-agent") || "unknown";
  let hash = 0;
  for (let i = 0; i < ua.length; i++) {
    hash = (hash << 5) - hash + ua.charCodeAt(i);
    hash |= 0;
  }
  return `${prefix}:ua-${hash}`;
}
