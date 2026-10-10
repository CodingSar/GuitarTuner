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

// Exposes an element's text as a string-or-null property.
function readoutOf(element: HTMLElement): {
  hidden: boolean;
  textContent: string | null;
} {
  return Object.assign(hiddenFlag(element), {
    get textContent() {
      return element.textContent;
    },
    set textContent(value: string | null) {
      element.textContent = value;
    },
  });
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
    readout: readoutOf(byId<HTMLElement>(doc, "readout")),
  };
  mountListening(view, browserMicrophone);
}

mountTunerPage(document);
