import type { Node } from '../Node';

export class Slice {
  constructor(content: Node[]) {}

  // static methods

  /**
   * An empty slice
   */
  static get empty(): Slice {
    return new Slice([]);
  }
}
