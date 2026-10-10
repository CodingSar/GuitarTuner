// A note to place: the string it is played on and the time it is hit.
export interface LayoutNote {
  readonly string: number;
  readonly fret: number;
  readonly hitTime: number;
}

// Where a note is drawn: its string row and its canvas y.
export interface PlacedNote {
  readonly row: number;
  readonly y: number;
  readonly fret: number;
}

export function handler(
  notes: readonly LayoutNote[],
  now: number,
  speed: number,
  hitLineY: number,
): readonly PlacedNote[] {
  return notes.map((note) => ({
    row: note.string - 1,
    y: hitLineY - (note.hitTime - now) * speed,
    fret: note.fret,
  }));
}
