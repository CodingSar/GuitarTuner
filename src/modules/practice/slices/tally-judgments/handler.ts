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
  let hits = 0;
  let missed = 0;
  let streak = 0;
  for (const judgment of judgments) {
    if (judgment === "hit") {
      hits += 1;
      streak += 1;
    } else if (judgment === "missed") {
      missed += 1;
      streak = 0;
    }
  }
  return { hits, missed, streak };
}
