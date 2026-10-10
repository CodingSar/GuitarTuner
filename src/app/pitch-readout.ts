import type { Reading } from "../modules/tuner";

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
