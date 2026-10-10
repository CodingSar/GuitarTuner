// The BPM field and its -/+ and reset buttons on the practice page. The field
// holds the tempo the session starts at; Start checks it before it begins.
export interface TempoFieldElements {
  input: HTMLInputElement;
  error: HTMLElement;
  minus: HTMLButtonElement;
  plus: HTMLButtonElement;
  reset: HTMLButtonElement;
}

// What the field calls on the practice controller.
export interface TempoPractice {
  defaultTempo(): number;
  start(tempo?: number): void;
}

export function mountTempoField(
  elements: TempoFieldElements,
  practice: TempoPractice,
): { showDefault(): void; startFromField(): void } {
  throw new Error("not implemented");
}
