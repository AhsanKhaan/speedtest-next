import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { PerformanceOverlay } from "@/components/performance-overlay"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://speedtest.example.com"),
  title: "SpeedTest - Internet Speed Test | Measure Download, Upload, Ping & Latency",
  description:
    "Test your internet speed with our fast, accurate, and free speed test. Measure download, upload speeds, ping latency, and connection quality in seconds.",
  applicationName: "SpeedTest",
  keywords: [
    "speed test",
    "internet speed",
    "ping test",
    "bandwidth test",
    "connection test",
    "latency test",
    "upload test",
    "download test",
    "network latency",
    "ping latency",
  ],
  authors: [{ name: "SpeedTest" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://speedtest.example.com",
    title: "SpeedTest - Check Your Internet Speed",
    description: "Test your internet speed, ping, latency, and connection quality accurately and instantly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SpeedTest",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedTest - Internet Speed Test",
    description: "Measure your internet speed, ping, latency, and connection quality instantly",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased bg-background text-foreground dark`}>
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <Navbar />

          {children}

          {/* Footer with SEO links */}
          <Footer />
        </div>
        <PerformanceOverlay />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
