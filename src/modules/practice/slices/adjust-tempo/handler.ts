import { TEMPO_MAX, TEMPO_MIN } from "../../model";

// Moves a whole-number BPM by delta and keeps it within 20 to 240.
export function handler(bpm: number, delta: number): number {
  return Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, bpm + delta));
}
