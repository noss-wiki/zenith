/**
 * Adds some helper methods to the class e.g. adding eventlisteners that get removed when unmount is called
 */
export class DOMEventfull {
  #listeners: {
    element: Element;
    event: keyof HTMLElementEventMap;
    cb: (e: any) => any | void;
  }[] = [];
  /**
   * Removes all event listeners, to be used on the `onUnmount` hook to work with hmr
   */
  unmount() {
    for (const l of this.#listeners)
      l.element.removeEventListener(l.event, l.cb);
  }

  /**
   * Adds an eventListener to the element, and removes them when this block is unmounted.
   */
  addEventListener<E extends keyof HTMLElementEventMap>(
    element: Element,
    event: E,
    cb: (this: typeof this, e: HTMLElementEventMap[E]) => any | void
  ) {
    this.#listeners.push({ element, event, cb });
    // @ts-ignore
    element.addEventListener(event, cb.bind(this));
  }
}
