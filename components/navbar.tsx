"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/blogs", label: "Blogs" },
    { href: "/faqs", label: "FAQs" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 🔹 Logo */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <Zap className="w-5 h-5 text-accent" />
          <Link href="/" className="hover:text-accent transition-colors">
            Speed Test
          </Link>
        </div>

        {/* 🔹 Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* 🔹 Mobile Controls */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-md hover:bg-accent/10 transition-colors"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* 🔹 Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Optional dim overlay for focus (no blur) */}
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/30 md:hidden z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute w-full border-t border-border/50 bg-background dark:bg-gray-900 shadow-lg md:hidden z-50"
            >
              <div className="flex flex-col items-center space-y-4 py-6">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-base font-medium text-foreground hover:text-accent transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
