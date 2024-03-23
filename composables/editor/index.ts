import type { Block } from '../block';
import { TextBlock } from '../blocks/text';

type InputTypes =
  | 'insertParagraph'
  | 'insertLineBreak'
  | 'insertText'
  | 'deleteContentBackward';

export class Editor {
  root: HTMLElement;
  blocks: Block[] = [];

  #listeners: {
    element: Element;
    event: keyof HTMLElementEventMap;
    cb: (this: Editor, e: any) => any | void;
  }[] = [];

  constructor(root: HTMLElement) {
    this.root = root;
    this.addEventListener(this.root, 'input', (e) =>
      this.#input(e as InputEvent)
    );
    this.addEventListener(this.root, 'keydown', (e) => this.#keydown(e));

    const text = new TextBlock();
    text.render();
    this.root.appendChild(text.root);
    this.blocks.push(text);
  }
  /**
   * Removes all event listeners, to be used on the `onUnMount` hook to work with hmr
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
    cb: (this: Editor, e: HTMLElementEventMap[E]) => any | void
  ) {
    this.#listeners.push({ element, event, cb });
    // @ts-ignore
    element.addEventListener(event, cb.bind(this));
  }

  #input(e: InputEvent) {
    const t = e.target as HTMLElement | null;
    if (!t || t.getAttribute('data-content-editable-leaf') === null) return;
    const block = this.blocks.find((e) => e.root.contains(t));
    const index = block ? this.blocks.indexOf(block) : -1;
    if (!block || index === -1) return;
    const type = e.inputType as InputTypes;

    let carry: string | undefined;

    if (type === 'insertParagraph') {
      // Remove linebreak
      const node = (window.getSelection()?.anchorNode as Text) ?? undefined;
      if (node.data.endsWith('\n')) node.data = node.data.slice(0, -1);
      else {
        // check if caret was inside of the content, if so carry to new block
        const sel = window.getSelection();
        if (sel) {
          const offset = sel.focusOffset - 1;
          carry = node.data.slice(offset).trim();
          node.data = node.data.slice(0, offset);
        }
      }

      // Insert new node
      const text = new TextBlock(carry);
      text.render();
      this.blocks.splice(index + 1, 0, text);
      block.root.insertAdjacentElement('afterend', text.root);
      text.focus(0);
    }
  }

  #keydown(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null;
    if (!t || t.getAttribute('data-content-editable-leaf') === null) return;
    const block = this.blocks.find((e) => e.root.contains(t));
    const index = block ? this.blocks.indexOf(block) : -1;
    if (!block || index === -1) return;

    if (e.key === 'Enter' && e.ctrlKey) {
      // Insert new node
      const text = new TextBlock();
      text.render();
      this.blocks.splice(index, 1, text);
      block.root.insertAdjacentElement('afterend', text.root);
      text.focus();
    } else if (e.key === 'Backspace') {
      const sel = window.getSelection();

      if (
        sel &&
        sel.anchorNode &&
        sel.focusOffset < 1 &&
        index > 0 &&
        block.carryContentBackwards()
      ) {
        const prev = this.blocks[index - 1];
        const content = (sel.anchorNode as Text).data ?? '';
        prev.receiveContentBackwards(content.trim());
        if (content.length > 0) prev.focus(-content.length);
        else prev.focus();

        block.unmount();
        this.root.removeChild(block.root);
        this.blocks.splice(index, 1);
      }
    }
    // arrow key functionality
  }
}
