import type { Block } from './blocks';
import { createBlock } from './blocks';

type InputTypes =
  | 'insertParagraph'
  | 'insertLineBreak'
  | 'insertText'
  | 'deleteContentBackward';

export class Editor {
  root: HTMLElement;
  blocks: Block[] = [];

  editor: HTMLElement;

  #listeners: {
    element: Element;
    event: keyof HTMLElementEventMap;
    cb: (this: Editor, e: any) => any | void;
  }[] = [];

  constructor(root: HTMLElement) {
    this.root = root;
    this.editor = root.querySelector('[noss-editor-content]') as HTMLElement;
    if (!this.editor) {
      this.editor = document.createElement('div');
      this.editor.setAttribute('noss-editor-content', 'true');
      this.editor.className = 'content';

      this.root.innerHTML = '';
      this.root.appendChild(this.editor);
    }

    this.addEventListener(this.editor, 'input', (e) =>
      this.#input(e as InputEvent)
    );
    this.addEventListener(this.editor, 'keydown', (e) => this.#keydown(e));

    /* const text = new TextBlock();
    text.render();
    this.editor.appendChild(text.root);
    this.blocks.push(text); */

    const text = createBlock('text');
    this.editor.appendChild(text.root);
    this.blocks.push(text);
  }
  /**
   * Removes all event listeners, to be used on the `onUnMount` hook to work with hmr
   */
  unmount() {
    for (const l of this.#listeners)
      l.element.removeEventListener(l.event, l.cb);

    for (const b of this.blocks) b.unmount();
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
      const text = createBlock('text');
      this.blocks.splice(index + 1, 0, text);
      block.root.insertAdjacentElement('afterend', text.root);
      if (carry) text.instance.carry(carry);
      text.instance.focus(0);
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
      const text = createBlock('text');
      this.blocks.splice(index, 1, text);
      block.root.insertAdjacentElement('afterend', text.root);
      text.instance.focus();
    } else if (e.key === 'Backspace') {
      const sel = window.getSelection();

      if (
        sel &&
        sel.anchorNode &&
        sel.focusOffset < 1 &&
        index > 0 &&
        (block.meta.carry === 'backwards' || block.meta.carry === 'both')
      ) {
        const prev = this.blocks[index - 1];
        const content = (sel.anchorNode as Text).data ?? '';

        prev.instance.carry(content.trim());
        if (content.length > 0) prev.instance.focus(-content.length);
        else prev.instance.focus();

        block.unmount();
        this.blocks.splice(index, 1);
      }
    }
    // arrow key functionality
  }
}
