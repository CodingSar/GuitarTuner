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
  const matched = inputs.some(
    (input) =>
      input.string === note.string &&
      input.fret === note.fret &&
      Math.abs(input.time - note.hitTime) <= windowMs,
  );
  if (matched) {
    return "hit";
  }
  if (now > note.hitTime + windowMs) {
    return "missed";
  }
  return "pending";
}
