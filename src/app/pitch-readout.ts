import type { Reading, Target } from "../modules/tuner";

// Standard tuning until the tuning module provides the selected preset.
export const standardTargets: readonly Target[] = [
  { label: "E2", hz: 82.41 },
  { label: "A2", hz: 110 },
  { label: "D3", hz: 146.83 },
  { label: "G3", hz: 196 },
  { label: "B3", hz: 246.94 },
  { label: "E4", hz: 329.63 },
];

// The text the pitch readout shows for a reading.
export function describeReading(reading: Reading): string {
  if (reading.kind === "none") {
    return "No reliable pitch";
  }
  // Adding 0 turns -0 into 0 so zero reads as "+0".
  const cents = Math.round(reading.cents) + 0;
  const sign = cents >= 0 ? "+" : "";
  const tuned = reading.inTune ? ", in tune" : "";
  return `${reading.label} ${sign}${cents} cents${tuned}`;
}
