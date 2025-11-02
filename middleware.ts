// Rate limiting middleware for Edge Runtime
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple in-memory store for rate limiting (will reset on deployment)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 30 // requests per hour
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function getClientId(request: NextRequest): string {
  // Try multiple sources for IP
  const forwarded = request.headers.get("x-forwarded-for")
  const cfConnecting = request.headers.get("cf-connecting-ip")
  const ip = forwarded?.split(",")[0].trim() || cfConnecting || "unknown"
  return ip
}

function checkRateLimit(clientId: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(clientId)

  if (!record || record.resetTime < now) {
    // New window or expired
    rateLimitStore.set(clientId, { count: 1, resetTime: now + WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT - 1 }
  }

  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: RATE_LIMIT - record.count }
}

export function middleware(request: NextRequest) {
  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const clientId = getClientId(request)
    const { allowed, remaining } = checkRateLimit(clientId)

    if (!allowed) {
      console.log(`[Rate Limit] Blocked request from ${clientId}`)
      return new NextResponse(JSON.stringify({ error: "Rate limit exceeded. Max 30 tests per hour." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "3600",
        },
      })
    }

    // Add rate limit headers to response
    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
    response.headers.set("X-RateLimit-Limit", RATE_LIMIT.toString())
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
