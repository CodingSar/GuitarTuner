import { TEMPO_MAX, TEMPO_MIN } from "../../model";

// Checks the text typed into the BPM field: a whole number from 20 to 240.
export type TempoResult =
  | { readonly ok: true; readonly bpm: number }
  | { readonly ok: false; readonly reason: string };

const REASON = `Enter a whole number from ${TEMPO_MIN} to ${TEMPO_MAX}`;

export function handler(text: string): TempoResult {
  if (!/^\d+$/.test(text)) {
    return { ok: false, reason: REASON };
  }
  const bpm = Number(text);
  if (bpm < TEMPO_MIN || bpm > TEMPO_MAX) {
    return { ok: false, reason: REASON };
  }
  return { ok: true, bpm };
}
