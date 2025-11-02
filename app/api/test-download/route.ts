// Download speed test - serve test file with proper caching headers
export const maxDuration = 30

export async function GET(request: Request) {
  const url = new URL(request.url)
  const size = Number.parseInt(url.searchParams.get("size") || "5242880") // Default 5MB

  // Limit size to prevent abuse
  const maxSize = 10 * 1024 * 1024 // 10MB max
  const testSize = Math.min(Math.max(size, 1024 * 1024), maxSize) // 1MB to 10MB

  try {
    // Generate test data
    const chunks: Uint8Array[] = []
    const chunkSize = 256 * 1024 // 256KB chunks

    for (let i = 0; i < testSize; i += chunkSize) {
      const size = Math.min(chunkSize, testSize - i)
      const chunk = new Uint8Array(size)
      for (let j = 0; j < size; j++) {
        chunk[j] = Math.floor(Math.random() * 256)
      }
      chunks.push(chunk)
    }

    const blob = new Blob(chunks, { type: "application/octet-stream" })

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": testSize.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Download test failed" }), { status: 500 })
  }
}
