import type { Block } from '../blocks';
import type { ComponentType, ComponentClass, Component } from './components';
import type { InputData } from '../blocks/data';
import { ExportReason, FocusReason } from '../blocks/hooks';
import { DOMEventfull } from '../classes/DOMEventfull';
import { createComponent } from './components';
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

  add<T extends string>(index: number, type: T): Block<T> {
    const block = createBlock(type);
    if (index === 0) {
      if (this.blocks.length > 0)
        this.blocks[0].root.insertAdjacentElement('beforebegin', block.root);
      else this.editor.appendChild(block.root);
    } else {
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

    if (type === 'insertParagraph') {
      let carry = false;
      // Remove linebreak
      const node = (window.getSelection()?.anchorNode ?? undefined) as
        | Text
        | undefined;
      if (node && node.data.endsWith('\n')) node.data = node.data.slice(0, -1);
      else {
        carry = true;
      }

      if (block.meta.inputs === 1) {
        const data = block.instance.export(ExportReason.CheckEmpty);

        if (
          block.meta.insertEmptyBehaviour === 'text' &&
          (data.inputs[0].content.length === 0 ||
            data.inputs[0].content[0].content === '') // no InputData, or no content in first InputData
        ) {
          const text = this.add(index + 1, 'text');
          this.remove(block);

          useLazy(() => text.instance.focus(FocusReason.TurnInto));
        } else {
          let type = 'text';

          if (block.meta.insertTypeBehaviour === 'persistent')
            type = block.meta.type;

          // Insert new node
          const text = this.add(index + 1, type);
          if (carry) {
            const char = getCharAtSelection(block);
            if (char >= 0) {
              const res = block.instance.inputs[0].export(
                ExportReason.Carry,
                char
              );
              text.instance.inputs[0].carry(res);
            }
          }
          text.instance.focus(FocusReason.Insert);
        }
      } else {
        // call hook to determine what to do
      }
    } /*  else {
      console.log(type);
      e.preventDefault();
    } */
  }

  #keydown(e: KeyboardEvent) {
    const t = e.target as HTMLElement | null;
    if (!t || t.getAttribute('data-content-editable-leaf') === null) return;
    const block = this.blocks.find((e) => e.root.contains(t));
    const index = block ? this.blocks.indexOf(block) : -1;
    if (!block || index === -1) return;

    const sel = window.getSelection();

    // ctrl + enter; inserts new node below, no matter where cursor is located
    if (e.key === 'Enter' && e.ctrlKey) {
      const text = this.add(index + 1, 'text');
      useLazy(() => text.instance.focus(FocusReason.Insert));
    }
    // Backspace
    else if (e.key === 'Backspace') {
      const prev = this.blocks[index - 1];
      if (
        sel &&
        sel.anchorNode &&
        sel.anchorOffset === 0 &&
        sel.focusOffset === 0 &&
        block.meta.inputs === 1 &&
        (block.meta.carry === 'backwards' || block.meta.carry === 'both')
      ) {
        if (
          block.meta.deleteBehaviour === 'delete' &&
          prev &&
          prev.meta.deleteNextCarryBehaviour === true
        ) {
          const data = block.instance.inputs[0].export(ExportReason.Carry);
          prev.instance.carry(data);

          this.component('handle')?.hide(block);
          block.unmount();
          this.blocks.splice(index, 1);
        } else if (block.meta.deleteBehaviour === 'text') {
          const text = this.add(index + 1, 'text');
          const data = block.instance.export(ExportReason.TurnInto);
          text.instance.import(data);
          this.remove(block);

          useLazy(() => text.instance.focus(FocusReason.TurnInto));
        }
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
    // TODO: Format shortcuts, listen for the shortcut, find targeted input and calculate begin and end characters of selection
  }
}

/**
 * Only works on blocks with a single input
 * @returns `-1` means it failed, other positive values indicate the char
 */
function getCharAtSelection(block: Block): number {
  const sel = window.getSelection();
  if (!sel) return -1;

  const input = block.instance.inputs[0];
  const content = input.getContent(true);
  const data = content.find((e) => e.node === sel.focusNode);
  if (!data) return -1; // last char

  let res = 0;
  const index = content.indexOf(data);
  if (index > 0) {
    for (let i = 0; i < index; i++) {
      if (content[i].type === 'text') res += content[i].content.length;
      else res++;
    }
  }

  if (data.type !== 'text') res++;
  else res += sel.focusOffset - 1;

  return res;
}
