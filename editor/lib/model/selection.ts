import type { Node } from '../Node';
import type { Position, ResolvedPosData } from './position';
import type { DOMSelection } from './types';

export class Selection {
  isCollapsed: boolean = false;

  constructor(
    readonly anchor: Position, //
    readonly head: Position
  ) {}

  /**
   * @param node The node where to collapse the selection, leave empty for the selection's current anchor node
   * @param offset Optional offset into the node where to set the cursor
   */
  //collapse(node?: Node, offset?: number) {}

  static select(node: Node) {}

  /**
   * Creates a Selection from a DOMSelection
   * @param selection The DOMSelection to convert
   */
  static fromDOMSelection(selection: DOMSelection) {}
}
