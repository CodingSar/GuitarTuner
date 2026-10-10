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

export function handler(
  samples: Float32Array,
  sampleRate: number,
  targets: readonly Target[],
): Reading {
  throw new Error("not implemented");
}
