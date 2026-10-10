// The parts of the reference pitch field the reference view reads from and listens to.
export interface ReferenceView {
  input: { value: string; onChange(fn: () => void): void };
}

// Wires the reference pitch field to the tuning module and reports the reference in hertz.
export function mountReference(view: ReferenceView): { hz(): number } {
  throw new Error("not implemented");
}
