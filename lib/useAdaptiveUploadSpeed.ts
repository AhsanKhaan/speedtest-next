import { useCallback } from "react";

interface AdaptiveUploadOptions {
  warmupSizeMB?: number; // initial small upload for estimating speed
  maxSizeMB?: number;    // max test size
  parallel?: number;     // number of simultaneous uploads
  samples?: number;      // number of rounds for median smoothing
  onProgress?: (mbps: number) => void; // callback for live gauge update
}

/**
 * useAdaptiveUploadSpeed
 * Production-ready adaptive, parallel, duplex-safe upload test.
 * Works on modern browsers (Chrome 105+, Edge 105+, Firefox 110+, Safari 17+)
 * and gracefully falls back for older ones.
 */
export function useAdaptiveUploadSpeed() {
  const adaptiveUpload = useCallback(
    async ({
      warmupSizeMB = 1,
      maxSizeMB = 32,
      parallel = 3,
      samples = 2,
      onProgress,
    }: AdaptiveUploadOptions = {}): Promise<number> => {

      // Helper: create deterministic Uint8Array
      const makeBuffer = (bytes: number) => {
        const buf = new Uint8Array(bytes);
        for (let i = 0; i < buf.length; i++) buf[i] = i & 0xff;
        return buf;
      };

      // Helper: upload function (with duplex + fallback)
      const runUpload = async (bytes: number, streamId: number) => {
        const buffer = makeBuffer(bytes);
        const chunkSize = 64 * 1024; // 64 KiB
        let sent = 0;

        // Stream producer
        const stream = new ReadableStream({
          pull(controller) {
            const remaining = bytes - sent;
            if (remaining <= 0) {
              controller.close();
              return;
            }
            const toSend = Math.min(chunkSize, remaining);
            controller.enqueue(buffer.subarray(sent, sent + toSend));
            sent += toSend;
          },
        });

        const start = performance.now();
        let response: Response;

        try {

          type StreamFetchInit = RequestInit & { duplex?: "half" };  
          // Modern streaming fetch (requires duplex: 'half')
          const fetchOptions: StreamFetchInit = {
                method: "POST",
                body: stream,
                headers: { "Content-Type": "application/octet-stream" },
                duplex: "half",
            };

            response = await fetch("/api/upload", fetchOptions);
        } catch (err) {
          console.warn("[upload] Streaming not supported, using fallback.");
          // Fallback: send whole buffer for older browsers
          response = await fetch("/api/upload", {
            method: "POST",
            body: buffer,
            headers: { "Content-Type": "application/octet-stream" },
          });
        }

        const end = performance.now();
        const dur = (end - start) / 1000 || 0.001;
        const mbps = (bytes * 8) / 1e6 / dur;

        onProgress?.(Number(mbps.toFixed(2)));
        if (!response.ok) throw new Error(`Upload stream ${streamId} failed`);
        return mbps;
      };

      // Step 1: Warm-up small upload to determine baseline
      const warmupBytes = warmupSizeMB * 1024 * 1024;
      const warmupSpeed = await runUpload(warmupBytes, 0);
      console.log("[Warm-up Upload]", warmupSpeed, "Mbps");

      // Step 2: Choose optimal test size dynamically
      let testSizeMB =
        warmupSpeed < 5 ? 2 :
        warmupSpeed < 20 ? 4 :
        warmupSpeed < 100 ? 8 :
        warmupSpeed < 500 ? 16 : 32;

      testSizeMB = Math.min(testSizeMB, maxSizeMB);

      // Step 3: Run multiple parallel uploads across N samples
      const results: number[] = [];
      for (let s = 0; s < samples; s++) {
        const promises = [];
        for (let i = 0; i < parallel; i++) {
          promises.push(runUpload(testSizeMB * 1024 * 1024, i));
        }
        const speeds = await Promise.all(promises);
        const avg = speeds.reduce((a, b) => a + b, 0) / parallel;
        results.push(avg);
      }

      // Step 4: Return median result
      results.sort((a, b) => a - b);
      const mid = Math.floor(results.length / 2);
      const median =
        results.length % 2
          ? results[mid]
          : (results[mid - 1] + results[mid]) / 2;

      return Number(median.toFixed(2));
    },
    []
  );

  return { adaptiveUpload };
}
