// /app/api/ping/route.ts
export const runtime = "edge";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  try {
    const serverTs = Date.now();
    const payload = {
      message: "pong",
      serverTs,
      iso: new Date(serverTs).toISOString(),
      region: request.headers.get("x-vercel-edge-region") || "unknown",
      requestId: typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : undefined,
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...CORS_HEADERS,
      },
    });
  } catch (err: any) {
    console.error("[ping] error", err);
    return new Response(JSON.stringify({ error: "Ping failed", detail: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
}
