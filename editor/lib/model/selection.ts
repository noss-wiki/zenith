import type { Node } from '../Node';
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

  static fromDOMSelection(selection: DOMSelection) {}
}
