export const metadata = {
  title: "Frequently Asked Questions - Speed Test Help",
  description: "Find answers to common questions about speed tests, internet speed, ping, and latency.",
  robots: { index: true, follow: true },
}

export default function FAQsPage() {
  const faqs = [
    { q: "What is a good internet speed?", a: "Generally, 25+ Mbps is considered good for streaming and browsing." },
    { q: "What does ping mean?", a: "Ping measures latency - the time for data to travel to a server and back." },
    {
      q: "Why is my upload slower than download?",
      a: "Most connections are optimized for downloading rather than uploading data.",
    },
  ]

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16">
      <div className="space-y-8">
        <h1 className="text-5xl font-bold">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="card-elevated backdrop-blur-md bg-card/60 rounded-xl p-6 border border-border/50">
              <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
