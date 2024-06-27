import type { Node } from './node';
import type { Position } from './position';
import { locateNode } from './position';
import { Fragment } from './fragment';

// Document Range
export class Slice {
  /**
   * @param content The content of this slice
   * @param startDepth The depth where the slice starts in the content
   * @param endDepth The depth where the slice ends in the content
   */
  constructor(
    readonly content: Fragment,
    readonly startDepth: number,
    readonly endDepth: number
  ) {}

  // static methods

  /**
   * An empty slice
   */
  static get empty(): Slice {
    return new Slice(new Fragment([]), 0, 0);
  }
}

export function findCommonParent(from: Position, to: Position) {}
