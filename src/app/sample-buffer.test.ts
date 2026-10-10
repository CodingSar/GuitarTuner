import { describe, expect, it } from "vitest";
import { sampleBufferFor } from "./sample-buffer";

describe("sample buffer", () => {
  it("TASK-10#8 The time-domain buffer holds exactly fftSize samples, with fftSize a power of two from 32 to 32768", () => {
    expect(sampleBufferFor(32).length).toBe(32);
    expect(sampleBufferFor(4096).length).toBe(4096);
    expect(sampleBufferFor(32768).length).toBe(32768);
    expect(() => sampleBufferFor(16)).toThrow(RangeError);
    expect(() => sampleBufferFor(65536)).toThrow(RangeError);
    expect(() => sampleBufferFor(3000)).toThrow(RangeError);
  });
});
