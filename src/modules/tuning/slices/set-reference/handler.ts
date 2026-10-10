// Accepts a reference pitch in hertz; refuses anything that is not a positive finite number.
export function handler(referenceHz: number): number {
  if (!(Number.isFinite(referenceHz) && referenceHz > 0)) {
    throw new RangeError(
      `reference must be a positive number of hertz, got ${referenceHz}`,
    );
  }
  return referenceHz;
}
