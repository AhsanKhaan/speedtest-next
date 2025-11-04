// /app/api/test-download/route.ts
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
    const url = new URL(request.url);
    const sizeParam = url.searchParams.get("size");
    // default 5 MiB to match your client
    let size = sizeParam ? parseInt(sizeParam, 10) : 5 * 1024 * 1024;

    // sanitize & clamp (min 1 KB, max 100 MiB)
    if (!Number.isFinite(size) || size < 1024) size = 5 * 1024 * 1024;
    const MAX = 100 * 1024 * 1024;
    if (size > MAX) size = MAX;

    const chunkSize = 64 * 1024; // 64 KiB chunks
    const chunk = new Uint8Array(chunkSize);
    for (let i = 0; i < chunkSize; i++) chunk[i] = i & 0xff;

    let sent = 0;
    const stream = new ReadableStream({
      pull(controller) {
        try {
          const remaining = size - sent;
          if (remaining <= 0) {
            controller.close();
            return;
          }
          const toSend = Math.min(chunkSize, remaining);
          controller.enqueue(chunk.subarray(0, toSend));
          sent += toSend;
        } catch (err) {
          controller.error(err as any);
        }
      },
      cancel() {
        // client aborted — nothing special to do
      },
    });

    const headers: Record<string, string> = {
      ...CORS_HEADERS,
      "Content-Type": "application/octet-stream",
      "Content-Length": String(size),
      "X-Edge-Region": request.headers.get("x-vercel-edge-region") || "unknown",
      "X-Request-ID": typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : "",
    };

    return new Response(stream, { status: 200, headers });
  } catch (err: any) {
    console.error("[test-download] error", err);
    return new Response(JSON.stringify({ error: "Download failed", detail: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
}
