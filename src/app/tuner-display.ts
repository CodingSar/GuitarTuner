import type { Reading } from "../modules/tuner";

// The meter runs from -50 to +50 cents, centred on the target.
const METER_CENTS = 50;
// Shown in place of a note name when there is no reliable pitch.
const PLACEHOLDER = "–";

// What the tuner panel shows for one frame.
export interface TunerDisplay {
  // Nearest string label, or the placeholder.
  readonly note: string;
  // Needle position from 0 (-50 cents) to 1 (+50 cents), or undefined with no reading.
  readonly position: number | undefined;
  // The reading's in-tune flag, the same rule the readout text uses.
  readonly inTune: boolean;
  // Label of the string to mark in the string list, or undefined with no reading.
  readonly label: string | undefined;
}

// What the panel shows with no reliable pitch.
export const NO_PITCH: TunerDisplay = {
  note: PLACEHOLDER,
  position: undefined,
  inTune: false,
  label: undefined,
};

// Maps a reading to the note, meter and marked string. Cents past the meter
// edge pin the needle to the edge rather than hiding it.
export function displayOf(reading: Reading): TunerDisplay {
  if (reading.kind === "none") {
    return NO_PITCH;
  }
  const cents = Math.min(METER_CENTS, Math.max(-METER_CENTS, reading.cents));
  return {
    note: reading.label,
    position: (cents + METER_CENTS) / (2 * METER_CENTS),
    inTune: reading.inTune,
    label: reading.label,
  };
}
