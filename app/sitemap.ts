import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://speedtest.example.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ]
}
