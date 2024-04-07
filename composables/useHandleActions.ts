import type { Editor } from './editor';
import type { Block } from './editor/blocks';

type Default<T> = T extends string ? T : 'text';

export interface HandleActions {
  select(): void;
  addBelow<T>(type?: T): Block<Default<T>> | undefined;
  addAbove<T>(type?: T): Block<Default<T>> | undefined;
}

export function useHandleActions(editor: Editor): HandleActions {
  return {
    select() {},
    addBelow<T>(type?: T) {
      const block = editor.handle.active;
      if (!block) return;
      const i = editor.blocks.indexOf(block) + 1;
      if (i === 0) return;

      const inserted = editor.add(i, typeof type === 'string' ? type : 'text');
      setTimeout(() => inserted.interact.focus(), 0);
      return inserted as Block<Default<T>>;
    },
    addAbove<T>(type?: T) {
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
