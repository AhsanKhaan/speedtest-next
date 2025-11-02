"use client"

import { useState, useCallback, useEffect } from "react"
import { SpeedGauge } from "./speed-gauge"
import { TestResults } from "./test-results"
import { TestButton } from "./test-button"
import { initWebVitals } from "@/lib/web-vitals"
import { getUserLocation } from "@/lib/geolocation"
import { generateTestFile } from "@/lib/test-file-generator"

interface SpeedTestState {
  ping: number | null
  download: number | null
  upload: number | null
  isRunning: boolean
  error: string | null
}

interface SpeedTestContainerProps {
  onLoadingChange?: (isLoading: boolean) => void
}

export function SpeedTestContainer({ onLoadingChange }: SpeedTestContainerProps) {
  const [state, setState] = useState<SpeedTestState>({
    ping: null,
    download: null,
    upload: null,
    isRunning: false,
    error: null,
  })

  const [location, setLocation] = useState<any>(null)
  const [vitals, setVitals] = useState<any>({})

  // Initialize Web Vitals tracking
  useEffect(() => {
    initWebVitals(setVitals)
    getUserLocation().then(setLocation)
  }, [])

  useEffect(() => {
    onLoadingChange?.(state.isRunning)
  }, [state.isRunning, onLoadingChange])

  const testPing = useCallback(async (): Promise<number> => {
    try {
      const pings: number[] = []
      // Run 4 ping tests
      for (let i = 0; i < 4; i++) {
        const start = performance.now()
        const response = await fetch("/api/ping", { cache: "no-store" })
        const end = performance.now()
        if (response.ok) {
          pings.push(end - start)
        }
      }
      return pings.length > 0 ? pings.reduce((a, b) => a + b) / pings.length : 0
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

      // Read response body
      const buffer = await response.arrayBuffer()
      const end = performance.now()

      const duration = (end - start) / 1000 // Convert to seconds
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
      const uploadSize = 2 * 1024 * 1024 // 2MB upload
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
      download: null,
      upload: null,
    }))

    try {
      // Run tests sequentially
      const ping = await testPing()
      setState((prev) => ({ ...prev, ping }))

      const download = await testDownload()
      setState((prev) => ({ ...prev, download }))

      const upload = await testUpload()
      setState((prev) => ({ ...prev, upload }))

      // Log results
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ping,
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
      }))
    } finally {
      setState((prev) => ({ ...prev, isRunning: false }))
    }
  }, [testPing, testDownload, testUpload, location, vitals])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-background to-indigo-600 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="backdrop-blur-md bg-background/40 border-b border-border/20 sticky top-0">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center text-center gap-2">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SpeedTest
              </h1>
              <p className="text-lg text-muted-foreground">Check your internet speed instantly</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16 space-y-16">
          {/* Speed Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-8 border border-border/50">
              <SpeedGauge value={state.ping ?? 0} max={100} label="Ping" unit="ms" isActive={state.ping !== null} />
            </div>
            <div className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-8 border border-border/50">
              <SpeedGauge
                value={state.download ?? 0}
                max={1000}
                label="Download"
                unit="Mbps"
                isActive={state.download !== null}
              />
            </div>
            <div className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-8 border border-border/50">
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

          {/* Results */}
          {state.ping !== null && state.download !== null && state.upload !== null && (
            <div className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-8 border border-border/50">
              <TestResults
                ping={state.ping}
                download={state.download}
                upload={state.upload}
                location={location}
                vitals={vitals}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto backdrop-blur-md bg-background/40 border-t border-border/20">
          <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
            <p className="font-medium">SpeedTest - Accurate Internet Speed Testing</p>
            <p className="mt-2 opacity-75">Results are powered by Vercel's global edge network</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
