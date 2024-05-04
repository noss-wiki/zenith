import type { BlockDescription, ResolvedBlockDescription } from '.';

export type InputContent = {
  type: 'text';
  style: InputContentStyle;
  content: string;
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

export interface InputContentStyle {}
