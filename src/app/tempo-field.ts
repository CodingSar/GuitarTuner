import { adjustTempo, validateTempo } from "../modules/practice";

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

const STEP = 5;

export function mountTempoField(
  elements: TempoFieldElements,
  practice: TempoPractice,
): { showDefault(): void; startFromField(): void } {
  const { input, error, minus, plus, reset } = elements;

  function showDefault(): void {
    input.value = String(practice.defaultTempo());
    error.textContent = "";
  }

  function startFromField(): void {
    const result = validateTempo(input.value);
    if (!result.ok) {
      error.textContent = result.reason;
      return;
    }
    error.textContent = "";
    input.value = String(result.bpm);
    practice.start(result.bpm);
  }

  function nudge(delta: number): void {
    const result = validateTempo(input.value);
    if (!result.ok) {
      error.textContent = result.reason;
      return;
    }
    error.textContent = "";
    input.value = String(adjustTempo(result.bpm, delta));
  }

  minus.addEventListener("click", () => nudge(-STEP));
  plus.addEventListener("click", () => nudge(STEP));
  reset.addEventListener("click", () => showDefault());

  return { showDefault, startFromField };
}
