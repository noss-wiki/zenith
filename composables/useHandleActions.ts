import type { Editor } from './editor';
import type { Block } from './editor/blocks';
import { editor } from './editor';

type Default<T> = T extends string ? T : 'text';

export interface HandleActions {
  select(): void;
  remove(): void;

  addBelow<T>(type?: T): Block<Default<T>> | undefined;
  addAbove<T>(type?: T): Block<Default<T>> | undefined;
}

export function useHandleActions(): HandleActions {
  return {
    select() {
      if (!editor) return;

      const block = editor.handle.active;
      if (block) editor.handle.select();
    },
    remove() {
      if (!editor) return;

      const block = editor.handle.active;
      if (block) editor.remove(block);
      editor.handle.active = undefined;
    },
    addBelow<T>(type?: T) {
      if (!editor) return;

      const block = editor.handle.active;
      if (!block) return;
      const i = editor.blocks.indexOf(block) + 1;
      if (i === 0) return;

      const inserted = editor.add(i, typeof type === 'string' ? type : 'text');
      setTimeout(() => inserted.interact.focus(), 0);
      return inserted as Block<Default<T>>;
    },
    addAbove<T>(type?: T) {
      if (!editor) return;

      const block = editor.handle.active;
      if (!block) return;
      const i = editor.blocks.indexOf(block);
      if (i === -1) return;

      const inserted = editor.add(i, typeof type === 'string' ? type : 'text');
      setTimeout(() => inserted.interact.focus(), 0);
      return inserted as Block<Default<T>>;
    },
  };
}
