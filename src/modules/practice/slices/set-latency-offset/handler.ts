export interface LatencyOffset {
  readonly ms: number;
  adjust(time: number): number;
}

export function handler(ms: number): LatencyOffset {
  throw new Error("not implemented");
}
