type ElementEvent = `element:${keyof ElementEventAugmentations}`;
type ElementEventName<T extends string> = T extends `element:${infer H}`
  ? H
  : T;

interface ElementEventAugmentations extends HTMLElementEventMap {
  input: InputEvent;
}

type Listener = {
  type: string;
  cb: (e: any) => void;
  element?: Element;
};

export class Eventfull {
  #listeners: Listener[] = [];

  unmount() {
    for (const i of this.#listeners) {
      if (!i.type.startsWith('element:')) continue;
      if (!i.element)
        document.removeEventListener(i.type.replace('element:', ''), i.cb);
      else i.element.removeEventListener(i.type.replace('element:', ''), i.cb);
    }
  }

  on<T extends ElementEvent>(
    type: T,
    cb: (e: ElementEventAugmentations[ElementEventName<T>]) => void | any,
    element: Element
  ): void;
  on(type: string, cb: (e: any) => void): void;
  on(type: string, cb: (e: any) => void, element?: Element) {
    if (type.startsWith('element:')) {
      if (!element) document.addEventListener(type.replace('element:', ''), cb);
      else element.addEventListener(type.replace('element:', ''), cb);
    }

    this.#listeners.push({
      type,
      cb,
      element,
    });
  }
}
