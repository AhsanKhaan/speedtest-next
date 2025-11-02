"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export function Footer() {
  const [clientIp, setClientIp] = useState<string>("")

  useEffect(() => {
    const fetchClientIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        setClientIp(data.ip)
      } catch (error) {
        console.error("[v0] Failed to fetch client IP:", error)
      }
    }
    fetchClientIp()
  }, [])

  return (
    <footer className="mt-auto w-full border-t border-border/40 bg-background/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <h3 className="font-bold text-foreground">SpeedTest</h3>
            <p className="text-sm text-muted-foreground">
              Check your internet speed instantly with our reliable speed test tool.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blogs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Your Connection</h4>
            <p className="text-sm text-muted-foreground">
              {clientIp ? (
                <>
                  IP: <span className="font-mono text-accent">{clientIp}</span>
                </>
              ) : (
                <span className="text-xs">Loading IP...</span>
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>&copy; 2025 SpeedTest. All rights reserved.</p>
          <p>Powered by Vercel Edge Network</p>
        </div>
      </div>
    </footer>
  )
}
