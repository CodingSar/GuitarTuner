// Composition root: wires modules to the page. No business rules.
import { check } from "../modules/health";

// Writes the health answer into the element it is given.
export function renderHealth(target: HTMLElement): void {
  target.textContent = JSON.stringify(check());
}
