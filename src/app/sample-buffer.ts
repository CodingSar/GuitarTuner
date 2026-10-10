// The time-domain buffer the analyser fills, sized to fftSize samples.
export function sampleBufferFor(fftSize: number): Float32Array<ArrayBuffer> {
  const isPowerOfTwo =
    Number.isInteger(fftSize) && (fftSize & (fftSize - 1)) === 0;
  if (!isPowerOfTwo || fftSize < 32 || fftSize > 32768) {
    throw new RangeError(
      `fftSize must be a power of two from 32 to 32768, got ${fftSize}`,
    );
  }
  return new Float32Array(fftSize);
}
