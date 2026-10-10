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
  let from = settings.slowPerMs;
  let target = settings.slowPerMs;
  let rampStart = 0;

  function speedAt(now: number): number {
    const t = Math.min(Math.max((now - rampStart) / settings.rampMs, 0), 1);
    if (t >= 1) {
      return target;
    }
    return from + (target - from) * t;
  }

  return {
    speedAt,
    toggle(now: number): void {
      from = speedAt(now);
      rampStart = now;
      target =
        target === settings.slowPerMs ? settings.fastPerMs : settings.slowPerMs;
    },
    drawnDistance(hitTime: number, now: number): number {
      return (hitTime - now) * speedAt(now);
    },
  };
}
