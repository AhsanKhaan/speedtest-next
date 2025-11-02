// JSON-LD Structured Data for SEO
export function SEOSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SpeedTest",
    description: "Free internet speed test to measure download, upload and ping speeds",
    url: "https://speedtest.example.com",
    applicationCategory: "UtilitiesApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "10000",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
