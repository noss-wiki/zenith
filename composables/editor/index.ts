import type { Block } from './blocks';
import { Handle } from './handle';
import { createBlock } from './blocks';

type InputTypes =
  | 'insertParagraph'
  | 'insertLineBreak'
  | 'insertText'
  | 'deleteContentBackward';

export let editor: Editor | undefined;

export class Editor extends DOMEventfull {
  root: HTMLElement;
  mounted: boolean = false;
  blocks: Block[] = [];

  editor: HTMLElement;
  handle: Handle;

  selected: Block | undefined;

  #listeners: {
    element: Element;
    event: keyof HTMLElementEventMap;
    cb: (this: Editor, e: any) => any | void;
  }[] = [];

  constructor() {
    super();

    this.root = null as unknown as HTMLElement;
    this.editor = null as unknown as HTMLElement;
    this.handle = null as unknown as Handle;

    editor = this;
  }

  // Lifecycle

  mount(root: HTMLElement) {
    this.root = root;

    let editor = root.querySelector('[noss-editor-content]'),
      handle = root.querySelector('[noss-editor-handle]'),
      handleMenu = root.querySelector('[noss-editor-handle-menu]');
    if (!editor)
      return console.error('[editor] No content was found in the editor root.');
    if (!handle)
      return console.error('[editor] No handle was found in the editor root.');
    if (!handleMenu)
      return console.error(
        '[editor] No handle menu was found in the editor root.'
      );

    this.editor = editor as HTMLElement;
    this.handle = new Handle(
      this,
      handle as HTMLElement,
      handleMenu as HTMLElement
    );

    this.addEventListener(this.editor, 'input', (e) =>
      this.#input(e as InputEvent)
    );
    this.addEventListener(this.editor, 'keydown', (e) => this.#keydown(e));

    const text = createBlock('text');
    this.editor.appendChild(text.root);
    this.blocks.push(text);

    this.mounted = true;
  }

  unmount() {
    for (const l of this.#listeners)
      l.element.removeEventListener(l.event, l.cb);

    for (const b of this.blocks) b.unmount();
    this.handle.unmount();

    editor = undefined;
  }

  // Blocks

  add<T extends string>(index: number, type: T): Block<T> {
    const block = createBlock(type);
    if (index === 0)
      this.blocks[0].root.insertAdjacentElement('beforebegin', block.root);
    else {
      const curr = this.blocks[index - 1];
      curr.root.insertAdjacentElement('afterend', block.root);
    }
    this.blocks.splice(index, 0, block);
    return block;
  }

  remove(index: number | Block<string>) {
    let block: Block<string>;
    if (typeof index === 'number') block = this.blocks[index];
    else block = index;

    const i = this.blocks.indexOf(block);
    if (i === -1)
      return console.error("[editor] Block doesn't exist in the editor.");

    this.editor.removeChild(block.root);
    this.blocks.splice(i, 1);
    block.unmount();
  }

  select(block: Block) {
    if (!this.blocks.includes(block)) return;
    this.selected = block;
    block.root.classList.add('selected');
  }

  // Event listeners

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
