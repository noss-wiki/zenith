import type { Node } from './node';
import { Fragment } from './fragment';

// Document Range
export class Slice {
  constructor(readonly content: Fragment) {}

  // static methods

  /**
   * An empty slice
   */
  static get empty(): Slice {
    return new Slice(new Fragment([]));
  }
}
