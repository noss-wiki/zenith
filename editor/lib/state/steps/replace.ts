import type { Node } from '../../Node';
import { Selection } from '../../model/selection';
import { Position } from '../../model/position';
import { Step, type StepJSON } from '../step';

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
