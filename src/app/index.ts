// Composition root: wires modules to the page. No business rules.
import { check } from "../modules/health";
import { mountListening } from "./listening-view";
import type { Control, ListeningView } from "./listening-view";
import { browserMicrophone } from "./microphone";

// Writes the health answer into the element it is given.
export function renderHealth(target: HTMLElement): void {
  target.textContent = JSON.stringify(check());
}

// Looks up an element by id. A missing element is a broken page, so fail loudly.
function byId<T extends HTMLElement>(doc: Document, id: string): T {
  const element = doc.getElementById(id);
  if (!element) throw new Error(`Tuner page is missing #${id}`);
  return element as T;
}

// Exposes an element's hidden flag as a boolean.
function hiddenFlag(element: HTMLElement): { hidden: boolean } {
  return {
    get hidden() {
      return Boolean(element.hidden);
    },
    set hidden(value: boolean) {
      element.hidden = value;
    },
  };
}

// Adapts a button to the Control the listening view expects.
function control(button: HTMLButtonElement): Control {
  return Object.assign(hiddenFlag(button), {
    onClick(fn: () => void) {
      button.addEventListener("click", fn);
    },
  });
}

// Wires the tuner page's elements to the listening view.
export function mountTunerPage(doc: Document): void {
  const view: ListeningView = {
    status: byId<HTMLElement>(doc, "status"),
    start: control(byId<HTMLButtonElement>(doc, "start")),
    stop: control(byId<HTMLButtonElement>(doc, "stop")),
    readout: hiddenFlag(byId<HTMLElement>(doc, "readout")),
  };
  mountListening(view, browserMicrophone);
}

mountTunerPage(document);
