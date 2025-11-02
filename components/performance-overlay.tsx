"use client"

import { useState, useEffect } from "react"

interface PerformanceMetrics {
  ttfb?: number
  lcp?: number
  cls?: number
  fcp?: number
  memory?: number
}

export function PerformanceOverlay() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return

    const updateMetrics = () => {
      if (typeof window === "undefined") return

      const perf = performance
      const navigation = perf.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined

      const newMetrics: PerformanceMetrics = {}

      if (navigation) {
        newMetrics.ttfb = navigation.responseStart - navigation.fetchStart
        newMetrics.fcp = perf.getEntriesByType("paint").find((e) => e.name === "first-contentful-paint")?.startTime || 0
      }

      const lcp = perf.getEntriesByType("largest-contentful-paint")
      if (lcp.length > 0) {
        newMetrics.lcp = lcp[lcp.length - 1].startTime
      }

      if ("memory" in performance) {
        const memory = (performance as any).memory
        newMetrics.memory = Math.round(memory.usedJSHeapSize / 1048576) // MB
      }

      setMetrics(newMetrics)
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 1000)
    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== "development") return null

  return (
    <div
      className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg font-mono cursor-pointer z-50 max-w-xs"
      onClick={() => setIsVisible(!isVisible)}
    >
      <div className="flex items-center justify-between">
        <span>Performance</span>
        <span className="ml-2">⌄</span>
      </div>
      {isVisible && (
        <div className="mt-2 space-y-1">
          {metrics.ttfb && <div>TTFB: {Math.round(metrics.ttfb)}ms</div>}
          {metrics.fcp && <div>FCP: {Math.round(metrics.fcp)}ms</div>}
          {metrics.lcp && <div>LCP: {Math.round(metrics.lcp)}ms</div>}
          {metrics.memory && <div>Memory: {metrics.memory}MB</div>}
        </div>
      )}
    </div>
  )
}
