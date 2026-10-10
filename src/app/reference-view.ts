import { DEFAULT_REFERENCE_HZ, setReference } from "../modules/tuning";

// The parts of the reference pitch field the reference view reads from and listens to.
export interface ReferenceView {
  input: { value: string; onChange(fn: () => void): void };
}

// Wires the reference pitch field to the tuning module and reports the reference in hertz.
export function mountReference(view: ReferenceView): { hz(): number } {
  let accepted = DEFAULT_REFERENCE_HZ;

  // Reads the field and keeps the value only if the tuning module accepts it.
  const apply = (): void => {
    try {
      accepted = setReference(Number(view.input.value));
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
    }
  };

  apply();
  view.input.onChange(apply);
  return { hz: () => accepted };
}
