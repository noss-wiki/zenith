import type { Editor } from '.';
import type { Block } from './blocks';

export class Handle {
  editor: Editor;
  root: HTMLElement;

  active: Block<string> | undefined;

  constructor(editor: Editor, root: HTMLElement) {
    this.editor = editor;
    this.root = root;
  }

  move(item: number | string | Block<string>) {
    let block = this._getBlock(item);
    if (!block)
      return console.error(
        `Block id: ${item}, could not be found in an existing editor instance.\n  at Handle.move`
      );

    if (!block.instance._attached)
      return console.error(
        `Block id: ${item}, has no attached dom element.\n  at Handle.move`
      );

    const editorRect = this.editor.editor.getBoundingClientRect();
    const blockRect = block.instance._attached.getBoundingClientRect();

    const top = blockRect.top - editorRect.top;

    this.active = block;
    this.root.classList.remove('hidden');
    this.root.style.setProperty('--offset-top', `${top}px`);
  }

  hide(id: string) {
    if (this.active !== undefined && this.active === this._getBlock(id))
      this.root.classList.add('hidden');
  }

  _getBlock(item: number | string | Block<string>): Block<string> | undefined {
    let block: Block<string>;
    if (typeof item === 'number') block = this.editor.blocks[item];
    else if (typeof item === 'string') {
      const res = this.editor.blocks.find((e) => e.instance.id === item);
      if (!res) return undefined;
      block = res;
    } else block = item;
    return block;
  }
}
