// Edge function for ping test - measures latency
export const runtime = "edge"

export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    // Simulate ping response with minimal latency
    const endTime = Date.now()
    const latency = endTime - startTime

    return new Response(
      JSON.stringify({
        ping: Math.max(1, latency), // At least 1ms
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store",
          "X-Edge-Location": request.headers.get("x-vercel-edge-region") || "unknown",
        },
      },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: "Ping test failed" }), { status: 500 })
  }
}
