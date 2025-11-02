"use client"

import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"
import { Zap } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Zap className="w-5 h-5 text-accent" />
          <Link href="/" className="hover:text-accent transition-colors">
            SpeedTest
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/blogs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Blogs
          </Link>
          <Link href="/faqs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQs
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>

        <ThemeToggle />
      </div>
    </nav>
  )
}
