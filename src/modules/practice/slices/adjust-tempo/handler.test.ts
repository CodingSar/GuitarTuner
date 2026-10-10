import { describe, it, expect } from "vitest";
import { handler } from "./handler";

describe("adjust-tempo", () => {
  it("TASK-20#4 GIVEN the BPM field holds 100 WHEN the plus button is pressed THEN the BPM is 105", () => {
    expect(handler(100, 5)).toBe(105);
  });

  it("TASK-20#4 GIVEN the BPM field holds 100 WHEN the minus button is pressed THEN the BPM is 95", () => {
    expect(handler(100, -5)).toBe(95);
  });

  it("TASK-20#4 GIVEN the BPM field holds 238 WHEN the plus button is pressed THEN the BPM stays within the range at 240", () => {
    expect(handler(238, 5)).toBe(240);
  });

  it("TASK-20#4 GIVEN the BPM field holds 22 WHEN the minus button is pressed THEN the BPM stays within the range at 20", () => {
    expect(handler(22, -5)).toBe(20);
  });
});
