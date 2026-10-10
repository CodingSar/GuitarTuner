import type { Target } from "../modules/tuning";

// The parts of the tuning page the tuning view writes to and reads from.
export interface TuningView {
  preset: { value: string; onChange(fn: () => void): void };
  strings: { textContent: string | null };
}

// Wires the preset selector to the tuning module and names the strings.
export function mountTuning(view: TuningView): {
  targets(): readonly Target[];
} {
  throw new Error("not implemented");
}
