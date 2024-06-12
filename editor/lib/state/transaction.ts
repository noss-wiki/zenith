import type { EditorState } from '.';
import type { Node } from '../Node';
import type { Step } from './step';
import { Position } from '../model/position';
import { createNode } from '@/editor/nodes';
// Steps
import { InsertStep } from './steps/insert';

export class Transaction {
  readonly document: Node;
  readonly state: EditorState;
  readonly steps: Step[] = [];

  constructor(state: EditorState) {
    this.state = state;
    this.document = state.document;
  }

  /**
   * Adds a node to this nodes content, if insertion fails it will throw or return null depending on the value of `throwError`
   * @param pos The position where to insert the node, see {@link Position}
   * @param node The node to add, or the node type (node will be created automatically)
   */
  insert<T extends string>(pos: Position, node: T | Node) {
    if (typeof node === 'string') {
      const created = createNode(node);
      if (created === null)
        throw new Error(`Failed to create node of type: ${node}`);
      node = created;
    }

    this.steps.push(new InsertStep(pos, node));
    return this;
  }

  replace(from: Position, to: Position, content: Node | Node[]) {
    if (!Array.isArray(content)) content = [content];
    // create step
    return this;
  }

  // TODO: Enforce no changes after applying transaction
  /**
   * Calls the `apply` function on the linked editor state, which adds this transaction to the editor state.
   * After calling this or the function on the editor state, changes to this transaction are not allowed.
   */
  apply() {
    this.state.apply(this);
  }
}
