import type { Node } from './node';
import type { DOMSelection } from './types';
import { Position, calculateSteps } from './position';
import { Slice } from './slice';

export class Selection {
  constructor(
    public anchor: Position, //
    public head: Position
  ) {
    if (anchor.document !== head.document)
      throw new Error(
        'Document of the head position is different from the document of the anchor position'
      );
  }

  get isCollapsed() {
    return (
      this.anchor === this.head ||
      (this.anchor.depth === this.head.depth &&
        this.anchor.offset === this.head.offset &&
        this.anchor.parent === this.head.parent)
    );
  }

  /**
   * Collapses the selection to the current anchor, or to the node specified. Will throw if the node cannot be resolved in the document.
   * @param node The node where to collapse the selection, leave empty for the selection's current anchor node.
   * @param offset Optional offset into the node where to set the cursor.
   * @param document The document where the node is located, if not specified it will use the document of the current anchor node.
   */
  collapse(node?: Node, offset: number = 0, document?: Node) {
    if (!node) {
      this.head = this.anchor;
      return;
    }

    document ??= this.anchor.document;
    const pos = Position.offset(node, offset).resolve(document);
    if (!pos)
      throw new Error(
        'Failed to resolve node in the current document of the selection'
      );

    this.head = this.anchor = pos;
  }

  /**
   * Selects the node, which means the anchor will be placed right before the node, and the head right after.
   * @param document The document in which the node is located, this is needed to resolve the position correctly
   * @param node The node to select
   */
  static select(document: Node, node: Node) {
    const before = Position.before(node).resolve(document);
    if (!before) return;
    const after = Position.after(node).resolve(document);
    if (!after) return;

    return new Selection(before, after);
  }

  /**
   * Creates a Selection from a DOMSelection
   * @param selection The DOMSelection to convert
   */
  static fromDOMSelection(selection: DOMSelection) {}
}
