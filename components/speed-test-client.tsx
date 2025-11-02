"use client"

import { useState, useCallback, useEffect } from "react"
import { SpeedGauge } from "./speed-gauge"
import { TestResults } from "./test-results"
import { TestButton } from "./test-button"
import { TestLoader } from "./test-loader"
import { initWebVitals } from "@/lib/web-vitals"
import { generateTestFile } from "@/lib/test-file-generator"

interface SpeedTestState {
  ping: number | null
  latency: number | null
  download: number | null
  upload: number | null
  isRunning: boolean
  error: string | null
  testPhase: "idle" | "ping" | "download" | "upload"
}

interface SpeedTestClientProps {
  initialLocation?: { country: string; city: string; latitude?: number; longitude?: number }
}

export function SpeedTestClient({ initialLocation }: SpeedTestClientProps) {
  const [state, setState] = useState<SpeedTestState>({
    ping: null,
    latency: null,
    download: null,
    upload: null,
    isRunning: false,
    error: null,
    testPhase: "idle",
  })

  const [location, setLocation] = useState(initialLocation || null)
  const [vitals, setVitals] = useState<any>({})

  // Initialize Web Vitals tracking
  useEffect(() => {
    initWebVitals(setVitals)
  }, [])

  const testPing = useCallback(async (): Promise<{ ping: number; latency: number }> => {
    try {
      const pings: number[] = []
      for (let i = 0; i < 4; i++) {
        const start = performance.now()
        const response = await fetch("/api/ping", { cache: "no-store" })
        const end = performance.now()
        if (response.ok) {
          pings.push(end - start)
        }
      }

      if (pings.length === 0) throw new Error("Ping test failed")

      const avgPing = pings.reduce((a, b) => a + b) / pings.length
      const latency = Math.min(...pings)

      return { ping: avgPing, latency }
    } catch (error) {
      console.error("[v0] Ping test failed:", error)
      throw error
    }
  }, [])

  const testDownload = useCallback(async (): Promise<number> => {
    try {
      const fileSize = 5 * 1024 * 1024 // 5MB test file
      const testUrl = `/api/test-download?size=${fileSize}&t=${Date.now()}`

      const start = performance.now()
      const response = await fetch(testUrl, { cache: "no-store" })

      if (!response.ok) throw new Error("Download failed")

      const buffer = await response.arrayBuffer()
      const end = performance.now()

      const duration = (end - start) / 1000
      const sizeMB = buffer.byteLength / 1024 / 1024
      const speedMbps = (sizeMB * 8) / duration

      return Math.max(0.01, speedMbps)
    } catch (error) {
      console.error("[v0] Download test failed:", error)
      throw error
    }
  }, [])

  const testUpload = useCallback(async (): Promise<number> => {
    try {
      const uploadSize = 2 * 1024 * 1024
      const testFile = generateTestFile(uploadSize / 1024)

      const start = performance.now()
      const response = await fetch("/api/upload", {
        method: "POST",
        body: testFile,
        headers: { "Content-Type": "application/octet-stream" },
      })
      const end = performance.now()

      if (!response.ok) throw new Error("Upload failed")

      const result = await response.json()
      return result.upload || 0
    } catch (error) {
      console.error("[v0] Upload test failed:", error)
      throw error
    }
  }, [])

  const runTest = useCallback(async () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      error: null,
      ping: null,
      latency: null,
      download: null,
      upload: null,
      testPhase: "ping",
    }))

    try {
      setState((prev) => ({ ...prev, testPhase: "ping" }))
      const { ping, latency } = await testPing()
      setState((prev) => ({ ...prev, ping, latency }))

      setState((prev) => ({ ...prev, testPhase: "download" }))
      const download = await testDownload()
      setState((prev) => ({ ...prev, download }))

      setState((prev) => ({ ...prev, testPhase: "upload" }))
      const upload = await testUpload()
      setState((prev) => ({ ...prev, upload, testPhase: "idle" }))

      // Log results
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ping,
          latency,
          download,
          upload,
          location,
          vitals,
        }),
      }).catch((e) => console.error("[v0] Logging failed:", e))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Test failed",
        testPhase: "idle",
      }))
    } finally {
      setState((prev) => ({ ...prev, isRunning: false }))
    }
  }, [testPing, testDownload, testUpload, location, vitals])

  return (
    <>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16 space-y-16">
        {/* Speed Display Cards with section-specific loaders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-8 border border-border/50 relative">
            {state.testPhase === "ping" && <TestLoader />}
            <SpeedGauge value={state.ping ?? 0} max={100} label="Ping" unit="ms" isActive={state.ping !== null} />
          </div>

          <div className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-8 border border-border/50 relative">
            {state.testPhase === "download" && <TestLoader />}
            <SpeedGauge
              value={state.download ?? 0}
              max={1000}
              label="Download"
              unit="Mbps"
              isActive={state.download !== null}
            />
          </div>

          <div className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-8 border border-border/50 relative">
            {state.testPhase === "upload" && <TestLoader />}
            <SpeedGauge
              value={state.upload ?? 0}
              max={500}
              label="Upload"
              unit="Mbps"
              isActive={state.upload !== null}
            />
          </div>
        </div>

        {/* Test Button */}
        <div className="flex justify-center">
          <TestButton onClick={runTest} isLoading={state.isRunning} disabled={state.isRunning} />
        </div>

        {/* Error Message */}
        {state.error && (
          <div className="card-elevated backdrop-blur-md bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-destructive font-medium max-w-2xl mx-auto">
            ⚠️ {state.error}
          </div>
        )}

        {/* Results - Only show when all tests complete */}
        {state.ping !== null && state.download !== null && state.upload !== null && (
          <div className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-8 border border-border/50">
            <TestResults
              ping={state.ping}
              latency={state.latency}
              download={state.download}
              upload={state.upload}
              location={location}
              vitals={vitals}
            />
          </div>
        )}
      </main>
    </>
  )
}
