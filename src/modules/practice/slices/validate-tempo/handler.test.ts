import { describe, it, expect } from "vitest";
import { handler } from "./handler";

const REASON = "Enter a whole number from 20 to 240";

describe("validate-tempo", () => {
  it("TASK-20#3 GIVEN the BPM field holds the whole number 120 WHEN it is validated THEN it is accepted as 120", () => {
    expect(handler("120")).toEqual({ ok: true, bpm: 120 });
  });

  it("TASK-20#3 GIVEN the BPM field holds the lower limit 20 WHEN it is validated THEN it is accepted as 20", () => {
    expect(handler("20")).toEqual({ ok: true, bpm: 20 });
  });

  it("TASK-20#3 GIVEN the BPM field holds the upper limit 240 WHEN it is validated THEN it is accepted as 240", () => {
    expect(handler("240")).toEqual({ ok: true, bpm: 240 });
  });

  it("TASK-20#3 GIVEN the BPM field is empty WHEN it is validated THEN it is rejected with the reason saying why", () => {
    expect(handler("")).toEqual({ ok: false, reason: REASON });
  });

  it("TASK-20#3 GIVEN the BPM field holds the decimal 100.5 WHEN it is validated THEN it is rejected with the reason saying why", () => {
    expect(handler("100.5")).toEqual({ ok: false, reason: REASON });
  });

  it("TASK-20#3 GIVEN the BPM field holds letters WHEN it is validated THEN it is rejected with the reason saying why", () => {
    expect(handler("abc")).toEqual({ ok: false, reason: REASON });
  });

  it("TASK-20#3 GIVEN the BPM field holds a negative number WHEN it is validated THEN it is rejected with the reason saying why", () => {
    expect(handler("-5")).toEqual({ ok: false, reason: REASON });
  });

  it("TASK-20#3 GIVEN the BPM field holds 19, below the range WHEN it is validated THEN it is rejected with the reason saying why", () => {
    expect(handler("19")).toEqual({ ok: false, reason: REASON });
  });

  it("TASK-20#3 GIVEN the BPM field holds 241, above the range WHEN it is validated THEN it is rejected with the reason saying why", () => {
    expect(handler("241")).toEqual({ ok: false, reason: REASON });
  });
});
