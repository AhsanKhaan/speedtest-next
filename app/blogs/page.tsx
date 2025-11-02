export const metadata = {
  title: "Speed Test Blogs - Internet Speed Tips & Guides",
  description: "Read our latest blogs on internet speed, network optimization, and connection quality tips.",
  robots: { index: true, follow: true },
}

export default function BlogsPage() {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16">
      <div className="space-y-8">
        <h1 className="text-5xl font-bold">Speed Test Blogs</h1>
        <p className="text-muted-foreground text-lg">
          Coming soon - Expert guides on internet speed optimization and network performance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-6 border border-border/50">
            <h2 className="text-xl font-bold mb-2">How to Improve Internet Speed</h2>
            <p className="text-muted-foreground text-sm">Learn practical tips to optimize your internet connection.</p>
          </article>

          <article className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-6 border border-border/50">
            <h2 className="text-xl font-bold mb-2">Understanding Network Latency</h2>
            <p className="text-muted-foreground text-sm">
              Deep dive into latency, ping, and why it matters for your connection.
            </p>
          </article>
        </div>
      </div>
    </main>
  )
}
