import type {
  BlockDescription,
  ResolvedBlockDescription,
  Block,
  InputRegister,
} from '.';

export type InputContent = {
  type: 'text';
  style: FormatType[];
  content: string;
};
export type NodeInputContent = InputContent & {
  node: Text | Element;
};
export type AdvancedInputContent = InputContent & {
  char: number;
  index: number;
  node: Text | Element;
};
export type InputData = InputContent[];
export type ImportData = {
  index: number;
  content: InputData;
};

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
