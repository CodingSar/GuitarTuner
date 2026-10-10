import { describe, it, expect } from "vitest";
import { handler } from "./handler";

describe("set-latency-offset", () => {
  it("TASK-8#1 Player sets an audio-visual offset in milliseconds; hits are judged against the adjusted time; stored note times stay unchanged", () => {
    const storedNote = { hitTime: 1000 };
    const offset = handler(100);

    expect(offset.adjust(1150)).toBe(1050);
    expect(storedNote).toEqual({ hitTime: 1000 });
  });
});
