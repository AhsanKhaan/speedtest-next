"use client"

import { useEffect, useRef } from "react"
import { Download, Upload, Zap } from "lucide-react"

interface SpeedGaugeProps {
  value: number
  max: number
  label: string
  unit: string
  isActive?: boolean
  color?: string
}

export function SpeedGauge({ value, max, label, unit, isActive = false, color = "bg-accent" }: SpeedGaugeProps) {
  const gaugeRef = useRef<HTMLDivElement>(null)
  const percentage = Math.min((value / max) * 100, 100)

  const getIcon = () => {
    switch (label.toLowerCase()) {
      case "download":
        return <Download className="w-6 h-6 text-accent mb-2" />
      case "upload":
        return <Upload className="w-6 h-6 text-secondary mb-2" />
      case "ping":
      case "latency":
        return <Zap className="w-6 h-6 text-yellow-500 mb-2" />
      default:
        return null
    }
  }

  useEffect(() => {
    if (gaugeRef.current && isActive) {
      gaugeRef.current.style.setProperty("--gauge-percent", `${percentage}%`)
    }
  }, [percentage, isActive])

  return (
    <div className="flex flex-col items-center gap-4">
      {getIcon()}
      <div className="w-full max-w-xs">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            ref={gaugeRef}
            className={`${color} h-full gauge-fill transition-all duration-300`}
            style={{ width: isActive ? `${percentage}%` : "0%" }}
          />
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground uppercase tracking-wide">{label}</div>
        <div className="text-4xl font-bold text-foreground mt-1">
          {value.toFixed(2)}
          <span className="text-lg text-muted-foreground ml-1">{unit}</span>
        </div>
      </div>
    </div>
  )
}
