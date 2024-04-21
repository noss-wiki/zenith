import { editor } from './editor';

type Enter = () => void;
type Leave = () => void;

export function useHandle(id: string): [Enter, Leave] {
  return [
    () => editor?.component('handle')?.move(id),
    () => editor?.component('handle')?.hide(id),
  ];
}
