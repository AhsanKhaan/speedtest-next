// Generate test file for download speed testing
export function generateTestFile(sizeKB: number): Blob {
  const chunks: Uint8Array[] = []
  const chunkSize = 1024 * 1024 // 1MB chunks
  const targetBytes = sizeKB * 1024

  for (let i = 0; i < targetBytes; i += chunkSize) {
    const size = Math.min(chunkSize, targetBytes - i)
    const chunk = new Uint8Array(size)
    // Fill with pseudo-random data
    for (let j = 0; j < size; j++) {
      chunk[j] = Math.floor(Math.random() * 256)
    }
    chunks.push(chunk)
  }

  return new Blob(chunks, { type: "application/octet-stream" })
}
