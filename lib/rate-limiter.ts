// Simple in-memory rate limiter for edge/serverless environments
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }
}

const store: RateLimitStore = {}

export function checkRateLimit(
  identifier: string,
  limit = 30,
  windowMs: number = 60 * 60 * 1000, // 1 hour
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = store[identifier]

  if (!record || record.resetTime < now) {
    // New window or expired
    store[identifier] = { count: 1, resetTime: now + windowMs }
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: limit - record.count }
}

// Cleanup old entries every hour to prevent memory bloat
setInterval(
  () => {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  },
  60 * 60 * 1000,
)
