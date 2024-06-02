import type { Node } from '../Node';

export class Position {
  anchor: Node;

  resolved = false;

  constructor(anchor: Node) {
    this.anchor = anchor;
  }

  resolve(document: Node) {}

  // static methods
  /**
   * Creates a position that resolves before `anchor`
   */
  static before(anchor: Node) /* : Position */ {
    if (!anchor.parent) {
      // get a way to get the parent anyway, and throw if `anchor` is the document
    }
  }
  /**
   * Creates a position that resolves after `anchor`
   */
  static after(anchor: Node) /* : Position */ {}
  /**
   * Creates a position that resolves as a child of `anchor`, at index `childIndex`
   * @param childIndex The index where to resolve, leave empty for last item, and negative index to start from the last child
   */
  static in(anchor: Node, childIndex?: number) /* : Position */ {}
}
