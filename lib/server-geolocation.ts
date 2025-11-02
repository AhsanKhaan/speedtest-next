export async function getLocationData() {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    const data = await response.json()

    return {
      country: data.country_name || "Unknown",
      city: data.city || "Unknown",
      latitude: data.latitude,
      longitude: data.longitude,
    }
  } catch (error) {
    console.error("[v0] Server geolocation fetch failed:", error)
    return {
      country: "Unknown",
      city: "Unknown",
    }
  }
}
