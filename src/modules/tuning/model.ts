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

// The presets the tuner offers, keyed by name.
export const PRESETS: Record<PresetName, Preset> = {
  standard: {
    name: "standard",
    strings: [
      { label: "E2", midi: 40 },
      { label: "A2", midi: 45 },
      { label: "D3", midi: 50 },
      { label: "G3", midi: 55 },
      { label: "B3", midi: 59 },
      { label: "E4", midi: 64 },
    ],
  },
  "drop-d": {
    name: "drop-d",
    strings: [
      { label: "D2", midi: 38 },
      { label: "A2", midi: 45 },
      { label: "D3", midi: 50 },
      { label: "G3", midi: 55 },
      { label: "B3", midi: 59 },
      { label: "E4", midi: 64 },
    ],
  },
};

export function targetsFor(
  preset: Preset,
  referenceHz: number,
): readonly Target[] {
  return preset.strings.map((string) => ({
    label: string.label,
    hz: referenceHz * 2 ** ((string.midi - 69) / 12),
  }));
}
