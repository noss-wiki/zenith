import type { Block } from '../blocks';
import { FocusReason } from '../blocks/hooks';
import type { ComponentType, ComponentClass, Component } from './component';
import { DOMEventfull } from '../classes/DOMEventfull';
import { createComponent } from './component';
import { createBlock } from '../blocks';

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

  selected: Block | undefined;

  components: Component[] = [];

  constructor() {
    super();
    this.logger.init('editor');

    this.root = null as unknown as HTMLElement;
    this.editor = null as unknown as HTMLElement;

    editor = this;
  }

  // Lifecycle

  mount(root: HTMLElement) {
    this.root = root;

    let editor = root.querySelector('[noss-editor-content]'),
      handleMenu = root.querySelector('[noss-editor-handle-menu]');
    if (!editor)
      return this.logger.error(
        'No content was found in the editor root.',
        'Editor.mount'
      );
    if (!handleMenu)
      return this.logger.error(
        'No handle menu was found in the editor root.',
        'Editor.mount'
      );

    this.editor = editor as HTMLElement;

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
    super.unmount();

    for (const b of this.blocks) b.unmount();
    for (const c of this.components) c.unmount();

    editor = undefined;
  }

  /**
   * Used to attach an editor component (e.g. handle, actions, etc.) to this editor
   */
  attach<T extends ComponentType>(type: T): ComponentClass<T> {
    const e = this.components.find((e) => e.type === type);
    if (e !== undefined) {
      this.logger.error(
        `Component of type ${type}, already exists in this instance`,
        'Editor.attach'
      );
      return e as ComponentClass<T>;
    }
    let c = createComponent(type, this);
    this.components.push(c as Component);
    return c;
  }

  detach(component: Component) {
    const i = this.components.indexOf(component);
    if (i < 0) return; /*  this.logger.warn(
        "Failed to detach component as it isn't attached to this instance",
        'Editor.detach'
      ); */

    this.components[i].unmount();
    this.components.splice(i, 1);
  }

  componentCached: {
    [x: string]: Component;
  } = {};

  component<T extends ComponentType>(type: T): ComponentClass<T> | undefined {
    if (this.componentCached[type])
      return this.componentCached[type] as ComponentClass<T>;

    const c = this.components.find((e) => e.type === type);
    if (c) this.componentCached[type] = c;
    return c as ComponentClass<T> | undefined;
  }

  // Blocks

  // TODO: Update this to the new BlockData content
  add<T extends string>(index: number, type: T, content?: string): Block<T> {
    const block = createBlock(type);
    if (index === 0) {
      if (this.blocks.length > 0)
        this.blocks[0].root.insertAdjacentElement('beforebegin', block.root);
      else this.editor.appendChild(block.root);
    } else {
      const curr = this.blocks[index - 1];
      curr.root.insertAdjacentElement('afterend', block.root);
    }

    if (content) block.interact.carry(content);
    this.blocks.splice(index, 0, block);
    return block;
  }

  remove(index: number | Block<string>) {
    let block: Block<string>;
    if (typeof index === 'number') block = this.blocks[index];
    else block = index;

    const i = this.blocks.indexOf(block);
    if (i === -1)
      return this.logger.error(
        "Block doesn't exist in the editor.",
        'Editor.remove'
      );

    this.editor.removeChild(block.root);
    this.blocks.splice(i, 1);
    block.unmount();

    // insert block if none exist
    if (this.blocks.length === 0) this.add(0, 'text');
    const bi = Math.min(i, this.blocks.length - 1);

    this.blocks[bi].interact.focus();
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
      text.instance.focus(FocusReason.Insert);
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
      text.instance.focus(FocusReason.Insert);
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
        if (prev.meta.arrows === true)
          prev.instance.focus(FocusReason.ArrowPrevious);
      } else if (e.key === 'ArrowRight' && index < this.blocks.length - 1) {
        const next = this.blocks[index + 1];
        // TODO: selection's anchornode is the paragraph element if ctrl was used, but then offset doesn't work
        // TODO: work diffierently if shift is used (selections; focus the block and focus next block if pressed again, etc.)
        if (next.meta.arrows === true) {
          const input =
            this.blocks[index].instance.inputs[next.instance.inputs.length - 1];
          const nodeIndex = input.getContent().length - 1;

          if (sel.focusNode === input.ref.value)
            next.instance.focus(FocusReason.ArrowNext);
          else if (input.ref.value) {
            const node = input.ref.value.childNodes[nodeIndex];
            if (
              sel.focusNode === node &&
              sel.focusOffset === node.textContent?.length
            )
              next.instance.focus(FocusReason.ArrowNext);
          }
        }
      }
    }
  }
}
