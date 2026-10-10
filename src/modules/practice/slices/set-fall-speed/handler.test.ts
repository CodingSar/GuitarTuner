import { describe, it, expect } from "vitest";
import { handler } from "./handler";

const settings = { slowPerMs: 0.1, fastPerMs: 0.2, rampMs: 200 };

describe("set-fall-speed", () => {
  it("TASK-9#1 GIVEN notes are falling WHEN the player toggles faster or slower THEN the drawn speed changes and every hit time stays the same", () => {
    const fallSpeed = handler(settings);
    fallSpeed.toggle(1000);

    expect(fallSpeed.speedAt(1200)).toBe(0.2);
    expect(fallSpeed.drawnDistance(2000, 1200)).toBe(160);
  });

  it("TASK-9#2 The speed change ramps over a short period instead of jumping", () => {
    const fallSpeed = handler(settings);
    fallSpeed.toggle(1000);

    const midRamp = fallSpeed.speedAt(1100);
    expect(midRamp).toBeGreaterThan(0.1);
    expect(midRamp).toBeLessThan(0.2);
  });
});

describe("set-fall-speed (TASK-10)", () => {
  it("TASK-10#15 Hit time is fixed when a note is created, and the speed toggle changes only the drawn distance per millisecond", () => {
    const fallSpeed = handler(settings);
    const hitTime = 2000;

    expect(fallSpeed.drawnDistance(hitTime, 1000)).toBeCloseTo(100, 9);

    fallSpeed.toggle(1000);

    expect(fallSpeed.drawnDistance(hitTime, 1200)).toBeCloseTo(160, 9);
  });
});
