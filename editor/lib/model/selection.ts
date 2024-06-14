import type { Node } from '../Node';
import type { Position, ResolvedPosData } from './position';
import type { DOMSelection } from './types';

export class Selection {
  anchorNode?: Node;
  anchorOffset?: number;
  focusNode?: Node;
  focusOffset?: number;

  constructor() {}

  /**
   * @param node The node where to collapse the selection, leave empty for the selection's current anchor node
   * @param offset Optional offset into the node where to set the cursor
   */
  //collapse(node?: Node, offset?: number) {}

  /**
   * Creates a Selection from two positions
   * @param from The position of the anchor
   * @param to The position of the focus
   */
  static from(from: Position, to: Position) {
    return new Selection();
  }

  static select(node: Node) {}

  /**
   * Creates a Selection from a DOMSelection
   * @param selection The DOMSelection to convert
   */
  static fromDOMSelection(selection: DOMSelection) {}
}
