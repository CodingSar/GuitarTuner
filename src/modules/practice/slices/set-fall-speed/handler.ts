export interface FallSpeedSettings {
  readonly slowPerMs: number;
  readonly fastPerMs: number;
  readonly rampMs: number;
}

export interface FallSpeed {
  speedAt(now: number): number;
  toggle(now: number): void;
  drawnDistance(hitTime: number, now: number): number;
}

export function handler(settings: FallSpeedSettings): FallSpeed {
  throw new Error("not implemented");
}
