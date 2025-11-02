export interface WebVitals {
  ttfb: number
  lcp: number
  cls: number
  fcp: number
}

export function initWebVitals(callback: (vitals: Partial<WebVitals>) => void) {
  if (typeof window === "undefined") return

  // TTFB via Navigation Timing API
  if ("performance" in window) {
    const navTiming = performance.getEntriesByType("navigation")[0]
    if (navTiming) {
      const ttfb =
        (navTiming as PerformanceNavigationTiming).responseStart - (navTiming as PerformanceNavigationTiming).fetchStart
      if (ttfb > 0) {
        callback({ ttfb })
      }
    }

    // FCP via PerformancePaintTiming
    try {
      const paintEntries = performance.getEntriesByType("paint")
      const fcpEntry = paintEntries.find((entry) => entry.name === "first-contentful-paint")
      if (fcpEntry && fcpEntry.startTime > 0) {
        callback({ fcp: fcpEntry.startTime })
      }
    } catch (e) {
      console.error("[v0] FCP tracking failed:", e)
    }
  }

  // LCP via PerformanceObserver
  if ("PerformanceObserver" in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry.startTime > 0) {
          callback({ lcp: lastEntry.startTime })
        }
      })
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })

      return () => lcpObserver.disconnect()
    } catch (e) {
      console.error("[v0] LCP observer failed:", e)
    }

    try {
      const clsObserver = new PerformanceObserver((list) => {
        let cls = 0
        list.getEntries().forEach((entry) => {
          const hasRecentInput = (entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput
          if (!hasRecentInput) {
            const value = (entry as PerformanceEntry & { value?: number }).value || 0
            cls += value
          }
        })
        if (cls > 0) {
          callback({ cls })
        }
      })
      clsObserver.observe({ entryTypes: ["layout-shift"] })

      return () => clsObserver.disconnect()
    } catch (e) {
      console.error("[v0] CLS observer failed:", e)
    }
  }
}
