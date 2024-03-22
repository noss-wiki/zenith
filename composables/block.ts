/**
 * The type that gets stored, this includes all the data for the Block class to load everything properly
 */
export interface AbstractBlock {
  type: string; // this should be the name of a `BlockType`, prob add list type for this?
  data: any; // this is what the extended block class can read to determine what it shoud render, can be string, object, etc.
}

export interface BlockType {
  name: string;
  description: string;
  // icon: ...; the icon that gets showed in the commands list
  // also add preview prop for a preview image later?
}

/**
 * A base class that will be extended by the different BlockTypes.
 * Or just define what functions the class should implement and not extend?
 */
export class Block {
  name: string = 'Base';
  format: string = 'base';
  description: string = '';
  root: HTMLDivElement = this.createRoot();

  #listeners: {
    element: Element;
    event: keyof HTMLElementEventMap;
    cb: (this: Block, e: any) => any | void;
  }[] = [];

  constructor() {}

  unmount() {
    for (const l of this.#listeners)
      l.element.removeEventListener(l.event, l.cb);
  }

  render(): HTMLElement {
    return this.root;
  }

  focus(char?: number) {
    this.root.focus();
  }

  /**
   * Adds an eventListener to the element, and removes them when this block is unmounted.
   */
  addEventListener<E extends keyof HTMLElementEventMap>(
    element: Element,
    event: E,
    cb: (this: Block, e: HTMLElementEventMap[E]) => any | void
  ) {
    this.#listeners.push({ element, event, cb });
    // @ts-ignore
    element.addEventListener(event, cb.bind(this));
  }

  createRoot() {
    const div = document.createElement('div');
    div.className = `noss-selectable noss-${this.format}-block`;
    return div;
  }
}

/**
 * Extend this class for a simple text input, e.g. heading, text, quote, etc.
 */
export class SimpleBlock extends Block {
  text?: HTMLElement;
  textNode?: Text;

  focus(char?: number) {
    if (!this.text) return;
    if (typeof char !== 'number' || char > this.content.length)
      char = this.content.length;
    else if (char < 0) char = 0;

    if (!this.textNode) return;

    const range = document.createRange();
    const sel = window.getSelection();
    if (!sel) return;

    range.setStart(this.textNode, char);
    range.collapse(true);

    sel.removeAllRanges();
    setTimeout(() => {
      sel.addRange(range);
    }, 0);
  }

  render() {
    this.root = this.createRoot();
    this.text = document.createElement('p');
    this.textNode = document.createTextNode('');
    this.text.appendChild(this.textNode);
    this.text.setAttribute('contenteditable', 'true');
    this.text.setAttribute('data-content-editable-leaf', 'true');
    this.root.appendChild(this.text);
    return this.root;
  }

  get content(): string {
    return this.textNode?.textContent ?? '';
  }

  // use beforeInput event?
  // and make sure to always have some content, otherwise textnode gets removed
  #onInput(e: InputEvent) {
    const t = e.target as HTMLElement | null;
    if (!t || t.getAttribute('data-content-editable-leaf') === null) return;
  }
}
