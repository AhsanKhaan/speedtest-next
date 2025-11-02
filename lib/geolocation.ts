// Server-side version in lib/server-geolocation.ts is preferred for performance

export async function getUserLocation(): Promise<{
  country: string
  city: string
  latitude?: number
  longitude?: number
}> {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()

    return {
      country: data.country_name || "Unknown",
      city: data.city || "Unknown",
      latitude: data.latitude,
      longitude: data.longitude,
    }
  } catch (error) {
    console.error("[v0] Geolocation fetch failed:", error)
    return {
      country: "Unknown",
      city: "Unknown",
    }
  }
}
