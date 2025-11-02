export const metadata = {
  title: "Terms & Conditions - SpeedTest",
  description: "Read our terms and conditions for using SpeedTest.",
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16">
      <div className="space-y-8 max-w-3xl">
        <h1 className="text-5xl font-bold">Terms & Conditions</h1>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-3">Use of Service</h2>
            <p className="text-muted-foreground">
              SpeedTest is provided as-is for informational purposes. We do not guarantee accuracy and are not liable
              for any issues resulting from speed test results.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Restrictions</h2>
            <p className="text-muted-foreground">
              You agree not to use SpeedTest for any illegal purposes, network attacks, or excessive testing that could
              overload our servers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Modifications</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify or discontinue SpeedTest at any time without notice.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
