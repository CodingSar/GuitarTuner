// A note to place: the string it is played on and the time it is hit.
export interface LayoutNote {
  readonly string: number;
  readonly hitTime: number;
}

// Where a note is drawn: its string row and its canvas y.
export interface PlacedNote {
  readonly row: number;
  readonly y: number;
}

export function handler(
  notes: readonly LayoutNote[],
  now: number,
  speed: number,
  hitLineY: number,
): readonly PlacedNote[] {
  throw new Error("not implemented");
}
