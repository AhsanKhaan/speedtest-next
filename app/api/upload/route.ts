// /app/api/upload/route.ts
export const runtime = "edge";

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return new Response(JSON.stringify({ error: "No body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...HEADERS },
      });
    }

    const reader = request.body.getReader();
    let received = 0;
    const start = Date.now();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value?.byteLength ?? 0;
    }

    const end = Date.now();
    const duration = (end - start) / 1000 || 0.001;
    const serverMbps = (received * 8) / 1e6 / duration;

    return new Response(
      JSON.stringify({
        message: "Upload complete",
        receivedBytes: received,
        serverMbps: Number(serverMbps.toFixed(2)),
        duration,
        region: request.headers.get("x-vercel-edge-region") || "unknown",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...HEADERS },
      }
    );
  } catch (err: any) {
    console.error("[upload route] error", err);
    return new Response(
      JSON.stringify({ error: "Upload failed", details: String(err) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...HEADERS },
      }
    );
  }
}
