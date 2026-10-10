import { describe, expect, it } from "vitest";
import { handler } from "./handler";
import type { Reading, Target } from "./handler";

const SAMPLE_RATE = 44100;
const LENGTH = 4096;

const TARGETS: readonly Target[] = [
  { label: "E2", hz: 82.41 },
  { label: "A2", hz: 110 },
  { label: "D3", hz: 146.83 },
];

// A steady sine at the given frequency, one value per sample.
function sine(hz: number): Float32Array {
  const samples = new Float32Array(LENGTH);
  for (let i = 0; i < LENGTH; i += 1) {
    samples[i] = Math.sin((2 * Math.PI * hz * i) / SAMPLE_RATE);
  }
  return samples;
}

// A frequency the given number of cents above 110 Hz (A2).
const aboveA2 = (cents: number): number => 110 * 2 ** (cents / 1200);

// Deviation in cents, or NaN when there is no reading so the assertion fails.
function centsOf(reading: Reading): number {
  return reading.kind === "reading" ? reading.cents : Number.NaN;
}

describe("read pitch", () => {
  it("TASK-5#1 the nearest string and its deviation in cents are shown for a steady tone near a target", () => {
    const reading = handler(sine(aboveA2(12)), SAMPLE_RATE, TARGETS);
    expect(reading).toMatchObject({ kind: "reading", label: "A2" });
    expect(centsOf(reading)).toBeCloseTo(12, 0);
  });

  it("TASK-5#2 no reliable pitch is reported when the input is silent", () => {
    const silence = new Float32Array(LENGTH);
    const reading = handler(silence, SAMPLE_RATE, TARGETS);
    expect(reading).toEqual({ kind: "none" });
  });

  it("TASK-5#3 a reading within plus or minus 5 cents of the target is shown as in tune", () => {
    const reading = handler(sine(aboveA2(4)), SAMPLE_RATE, TARGETS);
    expect(reading).toMatchObject({
      kind: "reading",
      label: "A2",
      inTune: true,
    });
    expect(centsOf(reading)).toBeCloseTo(4, 0);
  });
});
