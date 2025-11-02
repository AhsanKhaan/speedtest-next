export const metadata = {
  title: "Privacy Policy - SpeedTest",
  description: "Read our privacy policy to understand how we handle your data.",
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16">
      <div className="space-y-8 max-w-3xl">
        <h1 className="text-5xl font-bold">Privacy Policy</h1>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-3">Data Collection</h2>
            <p className="text-muted-foreground">
              We collect speed test results and location data to improve our service. Your IP address is used only to
              determine your location.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Data Usage</h2>
            <p className="text-muted-foreground">
              Your test results are used to generate statistics and improve our speed test algorithms. Personal data is
              never shared with third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies to store your theme preference. No tracking cookies are used.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
