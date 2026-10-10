// Checks the text typed into the BPM field: a whole number from 20 to 240.
export type TempoResult =
  | { readonly ok: true; readonly bpm: number }
  | { readonly ok: false; readonly reason: string };

export function handler(text: string): TempoResult {
  throw new Error("not implemented");
}
