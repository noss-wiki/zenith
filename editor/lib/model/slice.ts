import type { Node } from '../Node';

export class Slice {
  content: Node[];

  constructor(content: Node[]) {
    this.content = content;
  }

  // static methods

  /**
   * An empty slice
   */
  static get empty(): Slice {
    return new Slice([]);
  }
}
