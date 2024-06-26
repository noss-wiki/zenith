import type { Node } from '../../model/node';
import { Selection } from '../../model/selection';
import { Step } from '../step';

export class InsertStep extends Step {
  id = 'replace';

  constructor(
    readonly sel: Selection, //
    readonly node: Node
  ) {
    super();
  }

  apply(document: Node): boolean {
    return false;
  }

  undo(document: Node): boolean {
    return false;
  }
}
