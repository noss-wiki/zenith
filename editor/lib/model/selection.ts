import type { Node } from './node';
import type { DOMSelection } from './types';
import { Position } from './position';
import { Slice } from './slice';

export class Selection {
  constructor(
    public anchor: Position, //
    public head: Position
  ) {
    if (anchor.boundary !== head.boundary)
      throw new Error(
        'boundary of the head position is different from the boundary of the anchor position'
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
   * Tries to get the content in this selection
   */
  content() {
    return Slice.between(this.anchor, this.head);
  }

  /**
   * Collapses the selection to the current anchor, or to the node specified. Will throw if the node cannot be resolved in the boundary.
   * @param node The node where to collapse the selection, leave empty for the selection's current anchor node.
   * @param offset Optional offset into the node where to set the cursor.
   * @param boundary The boundary where the node is located, if not specified it will use the boundary of the current anchor node.
   */
  collapse(node?: Node, offset: number = 0, boundary?: Node) {
    if (!node) {
      this.head = this.anchor;
      return;
    }

    boundary ??= this.anchor.boundary;
    const pos = Position.offset(node, offset).resolve(boundary);
    if (!pos)
      throw new Error(
        'Failed to resolve node in the current boundary of the selection'
      );

    this.head = this.anchor = pos;
  }

  /**
   * Selects the node, which means the anchor will be placed right before the node, and the head right after.
   * @param boundary The boundary in which the node is located, this is needed to resolve the position correctly
   * @param node The node to select
   */
  static select(boundary: Node, node: Node) {
    const before = Position.before(node).resolve(boundary);
    if (!before) return;
    const after = Position.after(node).resolve(boundary);
    if (!after) return;

    return new Selection(before, after);
  }

  /**
   * Creates a Selection from a DOMSelection
   * @param selection The DOMSelection to convert
   */
  static fromDOMSelection(selection: DOMSelection) {}
}
