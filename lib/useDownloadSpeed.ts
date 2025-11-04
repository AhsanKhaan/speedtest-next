import { useCallback } from "react";

/**
 * useDownloadSpeed
 * Stream-based high-accuracy download tester with progress reporting.
 */
export function useDownloadSpeed() {
  const testDownload = useCallback(
    async ({
      fileSize = 8 * 1024 * 1024, // 8 MiB default
      onProgress,
    }: {
      fileSize?: number;
      onProgress?: (mbps: number) => void;
    }): Promise<number> => {
      const url = `/api/test-download?size=${fileSize}&t=${Date.now()}`;

      const startTime = performance.now();
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok || !response.body) throw new Error("Download failed");

      const reader = response.body.getReader();
      let received = 0;
      let firstByteTime = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const now = performance.now();
        if (firstByteTime === 0) firstByteTime = now;

        received += value?.byteLength ?? 0;

        if (onProgress) {
          const elapsedSec = (now - firstByteTime) / 1000 || 0.001;
          const mbps = (received * 8) / 1e6 / elapsedSec;
          onProgress(Number(mbps.toFixed(2)));
        }
      }

      const endTime = performance.now();
      const durationSec = (endTime - firstByteTime) / 1000 || 0.001;
      const mbps = (received * 8) / 1e6 / durationSec;

      return Number(mbps.toFixed(2));
    },
    []
  );

  return { testDownload };
}
