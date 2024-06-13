import type { Node } from '../../Node';
import { Position } from '../../model/position';
import { Step } from '../step';

export class InsertStep extends Step {
  id = 'insert';

  constructor(
    readonly pos: Position, //
    readonly node: Node
  ) {
    super();
  }

  apply(document: Node): boolean {
    const pos = this.pos.resolve(document);
    if (pos === undefined) return false;

    const index = Position.offsetToIndex(pos.parent, pos.offset);
    if (index === undefined) return false; // insert needs to not cut into nodes, TODO: allow this or create seperate step?

    return pos.parent.content.insert(this.node, index);
  }

  undo(document: Node): boolean {
    const pos = this.pos.resolve(document);
    if (pos === undefined) return false;

    const index = Position.offsetToIndex(pos.parent, pos.offset);
    if (index === undefined) return false;
    else if (pos.parent.content.nodes[index] !== this.node) return false;

    return pos.parent.content.remove(this.node);
  }
}
