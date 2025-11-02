// Log performance metrics
export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Log to console for Vercel monitoring
    console.log("[Speed Test Metrics]", {
      timestamp: new Date().toISOString(),
      ping: data.ping,
      download: data.download,
      upload: data.upload,
      userAgent: request.headers.get("user-agent"),
      ip: request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for"),
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Logging failed" }), { status: 500 })
  }
}
