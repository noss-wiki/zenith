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
  handle: HTMLElement; // Create helper class / object for this to easily move it

  #listeners: {
    element: Element;
    event: keyof HTMLElementEventMap;
    cb: (this: Editor, e: any) => any | void;
  }[] = [];

  constructor(root: HTMLElement) {
    this.root = root;
    this.editor = root.querySelector('[noss-editor-content]') as HTMLElement;
    this.handle = root.querySelector('[noss-editor-handle]') as HTMLElement;
    if (!this.editor)
      throw new Error(
        '[editor] No content section has found in the provided editor root.'
      );
    if (!this.handle)
      throw new Error(
        '[editor] No handle element has found in the provided editor root.'
      );

    this.addEventListener(this.editor, 'input', (e) =>
      this.#input(e as InputEvent)
    );
    this.addEventListener(this.editor, 'keydown', (e) => this.#keydown(e));

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
      if (carry) text.interact.carry(carry);
      text.interact.focus(0);
    }
  }

  #keydown(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null;
    if (!t || t.getAttribute('data-content-editable-leaf') === null) return;
    const block = this.blocks.find((e) => e.root.contains(t));
    const index = block ? this.blocks.indexOf(block) : -1;
    if (!block || index === -1) return;

    const sel = window.getSelection();

    if (e.key === 'Enter' && e.ctrlKey) {
      // Insert new node
      const text = createBlock('text');
      this.blocks.splice(index, 1, text);
      block.root.insertAdjacentElement('afterend', text.root);
      text.interact.focus();
    } else if (e.key === 'Backspace') {
      if (
        sel &&
        sel.anchorNode &&
        sel.focusOffset < 1 &&
        index > 0 &&
        (block.meta.carry === 'backwards' || block.meta.carry === 'both')
      ) {
        const prev = this.blocks[index - 1];
        const content = (sel.anchorNode as Text).data ?? '';

        prev.interact.carry(content.trim());
        if (content.length > 0) prev.interact.focus(-content.length);
        else prev.interact.focus();

        block.unmount();
        this.blocks.splice(index, 1);
      }
    }
    // Arrow keys
    else if (
      sel &&
      sel.anchorNode &&
      (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
    ) {
      if (e.key === 'ArrowLeft' && sel.focusOffset < 1 && index > 0) {
        const prev = this.blocks[index - 1];
        if (prev.meta.arrows === true) prev.interact.focus();
        else if (prev.meta.arrows === 'manual') {
          // call hook
        }
      } else if (e.key === 'ArrowRight' && index < this.blocks.length - 1) {
        const next = this.blocks[index + 1];
        // TODO: selection's anchornode is the paragraph element if ctrl was used, but then offset doesn't work
        // TODO: work diffierently if shift is used (selections)
        if (
          next.meta.arrows === true &&
          sel.focusOffset === block.instance.inputs[0].getContent().length
        ) {
          next.instance.inputs[0].focus(0);
        } else if (next.meta.arrows === 'manual') {
          // call hook
        }
      }
    }
  }
}
