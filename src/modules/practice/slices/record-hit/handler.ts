export type Judgment = "hit" | "missed" | "pending";

export interface JudgedNote {
  readonly string: number;
  readonly fret: number;
  readonly hitTime: number;
}

export interface PlayedInput {
  readonly string: number;
  readonly fret: number;
  readonly time: number;
}

export function handler(
  note: JudgedNote,
  inputs: readonly PlayedInput[],
  windowMs: number,
  now: number,
): Judgment {
  throw new Error("not implemented");
}
