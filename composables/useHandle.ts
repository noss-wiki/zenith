import type { Editor } from './editor';
import { editors } from './editor';

type Enter = () => void;
type Leave = () => void;

export function useHandle(id: string): [Enter, Leave] {
  let editor: Editor | undefined;

  return [
    () => {
      if (!editor && !(editor = getEditor(id)))
        return console.warn(
          `Block id: ${id}, could not be found in an existing editor instance.\n  at useHandle[0] (enter)`
        );

      editor.handle.move(id);
    },
    () => {
      if (!editor && !(editor = getEditor(id)))
        return console.warn(
          `Block id: ${id}, could not be found in an existing editor instance.\n  at useHandle[0] (enter)`
        );

      editor.handle.hide(id);
    },
  ];
}

function getEditor(id: string) {
  return editors.find((e) => e.blocks.find((e) => e.instance.id === id));
}

function getBlock(editor: Editor, id: string) {
  return editor.blocks.find((e) => e.instance.id === id);
}
