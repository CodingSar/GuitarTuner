export type PresetName = "standard" | "drop-d";

// One string of a preset: its note name and its MIDI note number.
export interface NoteSpec {
  label: string;
  midi: number;
}

// A named set of strings, listed from the lowest to the highest.
export interface Preset {
  name: PresetName;
  strings: readonly NoteSpec[];
}

// A string the tuner compares the heard pitch against.
export interface Target {
  readonly label: string;
  readonly hz: number;
}

export const DEFAULT_REFERENCE_HZ = 440;

export function targetsFor(
  preset: Preset,
  referenceHz: number,
): readonly Target[] {
  throw new Error("not implemented");
}
