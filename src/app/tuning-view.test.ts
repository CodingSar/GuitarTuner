import { describe, it, expect } from "vitest";
import { mountTuning } from "./tuning-view";
import type { TuningView } from "./tuning-view";

// Fake preset selector. onChange stores the handler so the test can fire it.
function fakePreset(value: string) {
  let changed: (() => void) | undefined;
  return {
    value,
    onChange: (fn: () => void) => {
      changed = fn;
    },
    change: () => {
      if (changed === undefined)
        throw new Error("preset has no change handler");
      changed();
    },
  };
}

function fakeTuningView() {
  const preset = fakePreset("standard");
  const strings: {
    labels: readonly string[];
    setLabels(labels: readonly string[]): void;
  } = {
    labels: [],
    setLabels(labels) {
      this.labels = labels;
    },
  };
  const view: TuningView = { preset, strings };
  return { view, preset, strings };
}

describe("tuning view", () => {
  it("TASK-2#1 the page names each string of standard tuning E2 A2 D3 G3 B3 E4 when the tuner opens", () => {
    const { view, strings } = fakeTuningView();
    mountTuning(view);
    expect(strings.labels).toEqual(["E2", "A2", "D3", "G3", "B3", "E4"]);
  });

  it("TASK-2#2 choosing drop D names the low string D2 and gives D2 at 73.42 Hz as the first target", () => {
    const { view, preset, strings } = fakeTuningView();
    const tuning = mountTuning(view);
    preset.value = "drop-d";
    preset.change();
    expect(strings.labels).toEqual(["D2", "A2", "D3", "G3", "B3", "E4"]);
    const low = tuning.targets()[0];
    expect(low?.label).toBe("D2");
    expect(Math.abs((low?.hz ?? Number.NaN) - 73.42)).toBeLessThan(0.01);
  });
});
