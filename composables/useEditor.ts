import type { Editor } from '../editor';
import { editor } from '../editor';

export function useEditor(): Editor | undefined {
  return editor;
}
