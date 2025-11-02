import { SpeedTestClient } from "@/components/speed-test-client"
import { getLocationData } from "@/lib/server-geolocation"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Free Internet Speed Test - Check Your Speed, Ping & Latency",
  description:
    "Test your internet speed including download, upload, ping, and latency. Get instant results with our fast and accurate speed test tool.",
  keywords:
    "internet speed test, ping test, download test, upload test, latency test, network speed, connection quality",
  openGraph: {
    title: "SpeedTest - Check Your Internet Speed",
    description: "Test your internet speed, ping, latency, and connection quality",
  },
}

export default async function Home() {
  const location = await getLocationData()

  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-400 via-background to-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col min-h-[calc(100vh-64px)]">
        <header className="backdrop-blur-md bg-background/40 border-b border-border/20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center text-center gap-2">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SpeedTest
              </h1>
              <p className="text-lg text-muted-foreground">Check your internet speed, ping, and latency instantly</p>
            </div>
          </div>
        </header>

        <SpeedTestClient initialLocation={location} />
      </div>
    </main>
  )
}
