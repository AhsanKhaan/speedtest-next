// Performance monitoring utilities
export interface MonitoringEvent {
  type: "test_start" | "test_complete" | "test_error" | "rate_limit"
  timestamp: number
  duration?: number
  error?: string
  results?: {
    ping: number
    download: number
    upload: number
  }
}

const events: MonitoringEvent[] = []

export function logEvent(event: Omit<MonitoringEvent, "timestamp">) {
  const fullEvent: MonitoringEvent = {
    ...event,
    timestamp: Date.now(),
  }

  events.push(fullEvent)

  // Keep only last 100 events to prevent memory bloat
  if (events.length > 100) {
    events.shift()
  }

  // Log to console for Vercel observability
  console.log("[SpeedTest Event]", fullEvent)
}

export function getEvents(): MonitoringEvent[] {
  return [...events]
}

export function sendAnalytics(data: {
  ping: number
  download: number
  upload: number
  [key: string]: any
}) {
  // Send to Vercel Analytics automatically via @vercel/analytics
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("speed-test-complete", {
        detail: data,
      }),
    )
  }
}
