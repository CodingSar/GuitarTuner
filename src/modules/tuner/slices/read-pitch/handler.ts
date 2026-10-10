// A target string the tuner compares the input against.
export interface Target {
  readonly label: string;
  readonly hz: number;
}

// The nearest string and its deviation in cents, or no reliable pitch.
export type Reading =
  | {
      readonly kind: "reading";
      readonly label: string;
      readonly cents: number;
      readonly inTune: boolean;
    }
  | { readonly kind: "none" };

// Pitch range the detector searches, in hertz.
const MIN_HZ = 60;
const MAX_HZ = 1000;
// Minimum normalized correlation for a pitch to count as reliable.
const CLARITY = 0.9;
// Largest deviation that still shows as in tune, in cents.
const IN_TUNE_CENTS = 5;

export function handler(
  samples: Float32Array,
  sampleRate: number,
  targets: readonly Target[],
): Reading {
  const n = samples.length;

  // Prefix sums of squared samples give the energy of any span.
  const prefix = new Float64Array(n + 1);
  for (let i = 0; i < n; i += 1) {
    const x = samples[i] ?? 0;
    prefix[i + 1] = (prefix[i] ?? 0) + x * x;
  }
  const total = prefix[n] ?? 0;
  if (total === 0) {
    return { kind: "none" };
  }

  // Normalized autocorrelation for each lag in the search range, plus one
  // neighbour on each side for the parabolic refinement.
  const minLag = Math.floor(sampleRate / MAX_HZ);
  const maxLag = Math.ceil(sampleRate / MIN_HZ);
  const corr = new Float64Array(maxLag + 2);
  for (let lag = minLag - 1; lag <= maxLag + 1; lag += 1) {
    let sum = 0;
    for (let i = 0; i + lag < n; i += 1) {
      sum += (samples[i] ?? 0) * (samples[i + lag] ?? 0);
    }
    const head = prefix[n - lag] ?? 0;
    const tail = total - (prefix[lag] ?? 0);
    corr[lag] = head > 0 && tail > 0 ? sum / Math.sqrt(head * tail) : 0;
  }

  let best = minLag;
  for (let lag = minLag; lag <= maxLag; lag += 1) {
    if ((corr[lag] ?? 0) > (corr[best] ?? 0)) {
      best = lag;
    }
  }
  if ((corr[best] ?? 0) < CLARITY) {
    return { kind: "none" };
  }

  // Parabolic interpolation around the peak refines the period in samples.
  const left = corr[best - 1] ?? 0;
  const mid = corr[best] ?? 0;
  const right = corr[best + 1] ?? 0;
  const curvature = left - 2 * mid + right;
  const shift = curvature === 0 ? 0 : (0.5 * (left - right)) / curvature;
  const hz = sampleRate / (best + shift);

  // The target with the smallest absolute deviation wins.
  let found: { label: string; cents: number } | undefined;
  for (const target of targets) {
    const cents = 1200 * Math.log2(hz / target.hz);
    if (found === undefined || Math.abs(cents) < Math.abs(found.cents)) {
      found = { label: target.label, cents };
    }
  }
  if (found === undefined) {
    return { kind: "none" };
  }

  return {
    kind: "reading",
    label: found.label,
    cents: found.cents,
    inTune: Math.abs(found.cents) <= IN_TUNE_CENTS,
  };
}
