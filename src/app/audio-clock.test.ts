import { afterEach, describe, expect, it, vi } from "vitest";
import { audioClock } from "./audio-clock";
import { handler as setLatencyOffset } from "../modules/practice/slices/set-latency-offset/handler";

// Fake AudioContext clock. suspend() and resume() record their calls.
function fakeContext(currentTime: number, baseLatency = 0, outputLatency = 0) {
  let suspends = 0;
  let resumes = 0;
  return {
    currentTime,
    baseLatency,
    outputLatency,
    suspend: async () => {
      suspends += 1;
    },
    resume: async () => {
      resumes += 1;
    },
    suspended: () => suspends,
    resumed: () => resumes,
  };
}

describe("audio clock", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("TASK-10#12 Note positions and hit judgments derive from AudioContext.currentTime, and requestAnimationFrame is used only for drawing", () => {
    // A wall clock and a frame callback that disagree must not move now().
    vi.spyOn(performance, "now").mockReturnValue(99999);
    vi.stubGlobal("requestAnimationFrame", () => 0);
    const context = fakeContext(2.5);
    const clock = audioClock(context);
    expect(clock.now()).toBe(2500);
    context.currentTime = 4;
    expect(clock.now()).toBe(4000);
  });

  it("TASK-10#13 Pausing suspends the AudioContext so that notes freeze with the audio clock", () => {
    const context = fakeContext(1);
    const clock = audioClock(context);
    clock.pause();
    expect(context.suspended()).toBe(1);
    const first = clock.now();
    const second = clock.now();
    expect(second).toBe(first);
    clock.resume();
    expect(context.resumed()).toBe(1);
  });

  it("TASK-10#14 Hits are judged against currentTime minus baseLatency and outputLatency plus the calibration offset, and stored note times are never edited", () => {
    const context = fakeContext(1.0, 0.01, 0.02);
    const clock = audioClock(context);
    const storedNote = { hitTime: 1000 };
    const offset = setLatencyOffset(100);
    expect(clock.heard()).toBeCloseTo(970, 6);
    expect(offset.adjust(clock.heard())).toBeCloseTo(870, 6);
    expect(storedNote).toEqual({ hitTime: 1000 });
  });
});
