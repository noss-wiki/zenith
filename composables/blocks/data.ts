import type {
  BlockDescription,
  ResolvedBlockDescription,
  Block,
  InputRegister,
} from '.';

export interface InputNode {
  type: 'text';
  style: FormatType[];
  content: string;
}

export interface InputNodeElement extends InputNode {
  node: Text | Element;
}

export interface InputNodeSelection extends InputNode {
  node: Text | Element;
  char: number;
  index: number;
}

export interface ImportData {
  index: number;
  content: InputNode[];
}

export interface BlockData {
  meta: ResolvedBlockDescription;
  inputs: ImportData[];
}

export interface BlockSelection {
  block: Block;
  input: InputRegister;
  /**
   * The number of the char in the block input content at which the selection anchor is positioned,
   * which means this can be more than the end.
   */
  start: number;
  /**
   * The number of the char in the block input content at which the selection focus is positioned,
   * which means this can be less than the start.
   */
  end: number;
}

export type FormatType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike-through'
  | 'accent';
export const formatTypes = [
  'bold',
  'italic',
  'underline',
  'strike-through',
  'accent',
] as const;

export interface BlockFormat extends BlockSelection {
  type: FormatType;
}
