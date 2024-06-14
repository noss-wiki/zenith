import type { Node } from '../../Node';
import type { IndexPosData } from '../../model/position';
import { locateNode } from '../../model/position';
import { Step } from '../step';

export class RemoveStep extends Step {
  id = 'remove';

  private pos?: IndexPosData;

  constructor(readonly node: Node) {
    super();
  }

  apply(document: Node): boolean {
    this.pos = locateNode(document, this.node);
    if (!this.pos) return false;

    return this.pos.parent.content.remove(this.node);
  }

  undo(document: Node): boolean {
    if (!this.pos || this.pos.document !== document) return false;

    return this.pos.parent.content.insert(this.node, this.pos.index);
  }
}
