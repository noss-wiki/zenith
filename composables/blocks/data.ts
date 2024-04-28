import type { BlockDescription, ResolvedBlockDescription } from '.';

export type InputContent = {
  type: 'text';
  style: {};
  content: string;
};
export type InputData = InputContent[];

export class BlockData {
  meta: ResolvedBlockDescription;

  constructor(meta: ResolvedBlockDescription) {
    this.meta = meta;
  }
}
