// Maps a detected pitch in hertz to the string and fret on the open strings
// whose pitch is nearest, within 50 cents. openHz index 0 is string 1, the
// high E. On a tie between candidates, prefer wins when it is one of them.
// A pitch more than 50 cents from every fret maps to undefined.

const MAX_FRET = 24;
const TOLERANCE_CENTS = 50;
const TIE_CENTS = 1;

interface Candidate {
  readonly string: number;
  readonly fret: number;
  readonly pitch: number;
  readonly cents: number;
}

function centsBetween(a: number, b: number): number {
  return 1200 * Math.log2(a / b);
}

export function handler(
  hz: number,
  openHz: readonly number[],
  prefer?: { readonly string: number; readonly fret: number },
): { readonly string: number; readonly fret: number } | undefined {
  // Candidates are pushed in string order, so the first tied one is on the lowest string.
  const candidates: Candidate[] = [];
  openHz.forEach((open, index) => {
    for (let fret = 0; fret <= MAX_FRET; fret++) {
      const pitch = open * 2 ** (fret / 12);
      const cents = centsBetween(hz, pitch);
      if (Math.abs(cents) <= TOLERANCE_CENTS) {
        candidates.push({ string: index + 1, fret, pitch, cents });
      }
    }
  });
  if (candidates.length === 0) {
    return undefined;
  }

  const best = candidates.reduce((a, c) =>
    Math.abs(c.cents) < Math.abs(a.cents) ? c : a,
  );
  const tied = candidates.filter(
    (c) => Math.abs(centsBetween(c.pitch, best.pitch)) <= TIE_CENTS,
  );
  const preferred = prefer
    ? tied.find((c) => c.string === prefer.string && c.fret === prefer.fret)
    : undefined;
  const chosen =
    preferred ?? tied.reduce((a, c) => (c.string < a.string ? c : a));
  return { string: chosen.string, fret: chosen.fret };
}
