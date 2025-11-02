"use client"

import { Card } from "@/components/ui/card"

interface TestResultsProps {
  ping: number
  latency?: number | null
  download: number
  upload: number
  location?: { country: string; city: string; latitude?: number; longitude?: number } | null
  vitals?: Record<string, number>
}

export function TestResults({ ping, latency, download, upload, location, vitals }: TestResultsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Test Results</h2>

      {/* Summary Card */}
      <Card className="bg-card border border-border p-6">
        <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
          <div>
            <p className="text-muted-foreground text-sm">Download</p>
            <p className="text-2xl font-bold text-primary">{download.toFixed(2)} Mbps</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Upload</p>
            <p className="text-2xl font-bold text-primary">{upload.toFixed(2)} Mbps</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Ping</p>
            <p className="text-2xl font-bold text-primary">{ping.toFixed(2)} ms</p>
          </div>
          {latency !== null && latency !== undefined && (
            <div>
              <p className="text-muted-foreground text-sm">Latency</p>
              <p className="text-2xl font-bold text-secondary">{latency.toFixed(2)} ms</p>
            </div>
          )}
        </div>

        {/* Location Card */}
        {location && (
          <div className="text-sm text-muted-foreground pt-4 border-t border-border">
            <p>
              Location: {location.city}, {location.country}
              {location.latitude && location.longitude && (
                <span className="ml-2 text-xs opacity-70">
                  ({location.latitude.toFixed(2)}, {location.longitude.toFixed(2)})
                </span>
              )}
            </p>
          </div>
        )}
      </Card>

      {/* Web Vitals */}
      {vitals && Object.keys(vitals).length > 0 && (
        <Card className="bg-card border border-border p-6">
          <h3 className="font-bold text-foreground mb-4">Web Vitals</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {vitals.ttfb && (
              <div>
                <p className="text-muted-foreground">TTFB</p>
                <p className="text-lg font-semibold text-foreground">{Math.round(vitals.ttfb)}ms</p>
              </div>
            )}
            {vitals.lcp && (
              <div>
                <p className="text-muted-foreground">LCP</p>
                <p className="text-lg font-semibold text-foreground">{Math.round(vitals.lcp)}ms</p>
              </div>
            )}
            {vitals.cls && (
              <div>
                <p className="text-muted-foreground">CLS</p>
                <p className="text-lg font-semibold text-foreground">{vitals.cls.toFixed(3)}</p>
              </div>
            )}
            {vitals.fcp && (
              <div>
                <p className="text-muted-foreground">FCP</p>
                <p className="text-lg font-semibold text-foreground">{Math.round(vitals.fcp)}ms</p>
              </div>
            )}
          </div>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Powered by Vercel Edge Network • {new Date().toLocaleString()}
      </p>
    </div>
  )
}
