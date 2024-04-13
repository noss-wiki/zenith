import { editor } from './editor';

type Enter = () => void;
type Leave = () => void;

export function useHandle(id: string): [Enter, Leave] {
  return [() => editor?.handle.move(id), () => editor?.handle.hide(id)];
}
