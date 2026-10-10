export interface LatencyOffset {
  readonly ms: number;
  adjust(time: number): number;
}

export function handler(ms: number): LatencyOffset {
  return {
    ms,
    adjust(time: number): number {
      return time - ms;
    },
  };
}
