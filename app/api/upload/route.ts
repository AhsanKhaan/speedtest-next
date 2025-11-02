// Node.js runtime for upload test - measures upload speed
export const maxDuration = 30

export async function POST(request: Request) {
  const startTime = Date.now()

  try {
    // Read and discard the uploaded data
    const buffer = await request.arrayBuffer()
    const endTime = Date.now()

    const duration = Math.max(1, endTime - startTime) // milliseconds
    const sizeKB = buffer.byteLength / 1024
    const speedMbps = (sizeKB / 1024 / (duration / 1000)) * 8 // Convert to Mbps

    return new Response(
      JSON.stringify({
        upload: Math.max(0.01, speedMbps),
        duration,
        size: buffer.byteLength,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store",
        },
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: "Upload test failed" }), { status: 500 })
  }
}
