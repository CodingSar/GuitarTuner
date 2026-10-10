import {
  DEFAULT_REFERENCE_HZ,
  selectPreset,
  targetsFor,
} from "../modules/tuning";
import type { PresetName, Target } from "../modules/tuning";

// The parts of the tuning page the tuning view writes to and reads from.
export interface TuningView {
  preset: { value: string; onChange(fn: () => void): void };
  strings: { setLabels(labels: readonly string[]): void };
}

// Wires the preset selector to the tuning module and lists the strings.
export function mountTuning(view: TuningView): {
  targets(referenceHz?: number): readonly Target[];
} {
  let current = view.preset.value as PresetName;

  const update = (): void => {
    current = view.preset.value as PresetName;
    view.strings.setLabels(
      selectPreset(current).strings.map((string) => string.label),
    );
  };

  update();
  view.preset.onChange(update);

  return {
    targets: (referenceHz: number = DEFAULT_REFERENCE_HZ) =>
      targetsFor(selectPreset(current), referenceHz),
  };
}
