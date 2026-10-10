import type { Judgment } from "../record-hit/handler";

// Counts over the judgments of a session, in note order.
// hits and missed count the "hit" and "missed" judgments. streak is the run of
// hits at the end of the list, skipping pending entries; a miss ends it at 0.
export type Tally = {
  readonly hits: number;
  readonly missed: number;
  readonly streak: number;
};

export function handler(judgments: readonly Judgment[]): Tally {
  throw new Error("not implemented");
}
