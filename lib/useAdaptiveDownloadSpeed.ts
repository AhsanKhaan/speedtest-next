import { useCallback } from "react";

interface AdaptiveOptions {
  warmupSizeMB?: number;
  maxSizeMB?: number;
  parallel?: number;
  onProgress?: (mbps: number) => void;
  samples?: number; // number of test rounds for median
}

export function useAdaptiveDownloadSpeed() {
  const adaptiveDownload = useCallback(
    async ({
      warmupSizeMB = 2,       // 2 MB warm-up
      maxSizeMB = 64,         // up to 64 MB
      parallel = 3,           // 3 streams for fast links
      samples = 3,            // average across 3 runs
      onProgress,
    }: AdaptiveOptions = {}): Promise<number> => {
      const runStream = async (sizeBytes: number, id: number) => {
        const url = `/api/test-download?size=${sizeBytes}&t=${Date.now()}&id=${id}`;
        const start = performance.now();
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok || !response.body) throw new Error("Stream fetch failed");

        const reader = response.body.getReader();
        let received = 0;
        let firstByte = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const now = performance.now();
          if (!firstByte) firstByte = now;
          received += value?.byteLength ?? 0;
          const elapsed = (now - (firstByte || start)) / 1000 || 0.001;
          const mbps = (received * 8) / 1e6 / elapsed;
          onProgress?.(mbps);
        }

        const end = performance.now();
        const dur = (end - (firstByte || start)) / 1000 || 0.001;
        return (received * 8) / 1e6 / dur;
      };

      // Step 1 – Warm-up
      const warmupSize = warmupSizeMB * 1024 * 1024;
      const warmupSpeed = await runStream(warmupSize, 0);
      console.log("[Warm-up]", warmupSpeed, "Mbps");

      // Step 2 – Select proper size
      let nextSizeMB = warmupSpeed < 10 ? 4 : warmupSpeed < 100 ? 8 : warmupSpeed < 300 ? 16 : 32;
      nextSizeMB = Math.min(nextSizeMB, maxSizeMB);

      // Step 3 – Run parallel streams, repeat N samples
      const results: number[] = [];
      for (let i = 0; i < samples; i++) {
        const promises = [];
        for (let j = 0; j < parallel; j++) {
          promises.push(runStream(nextSizeMB * 1024 * 1024, j));
        }
        const speeds = await Promise.all(promises);
        const total = speeds.reduce((a, b) => a + b, 0);
        const avg = total / parallel;
        results.push(avg);
      }

      // Step 4 – Return median
      results.sort((a, b) => a - b);
      const mid = Math.floor(results.length / 2);
      const median = results.length % 2 ? results[mid] : (results[mid - 1] + results[mid]) / 2;

      return Number(median.toFixed(2));
    },
    []
  );

  return { adaptiveDownload };
}
