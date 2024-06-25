import type { EditorState } from '.';
import type { Node } from '../model/node';
import type { Step } from './step';
import type { PositionLike } from '../model/position';
import { Position } from '../model/position';
import { createNode, createTextNode } from '@/editor/nodes';
// Steps
import { InsertStep } from './steps/insert';
import { RemoveStep } from './steps/remove';
import { Selection } from '../model/selection';

export class Transaction {
  readonly document: Node;
  readonly state: EditorState;
  readonly steps: Step[] = [];

  constructor(state: EditorState) {
    this.state = state;
    this.document = state.document;
  }

  /**
   * Adds an {@link InsertStep} to this transaction, which inserts a node into the current document.
   * @param node The node to add, or the node type (node will be created automatically).
   * @param pos The position where to insert the node, see {@link Position}.
   */
  insert<T extends string>(node: T | Node, pos: PositionLike) {
    if (typeof node === 'string') {
      const created = createNode(node);
      if (created === null)
        throw new Error(`Failed to create node of type: ${node}`);
      node = created;
    }

    this.steps.push(new InsertStep(pos, node));
    return this;
  }

  insertText(text: string, pos: PositionLike) {
    const resolvedPos = Position.resolve(this.document, pos);
    if (!resolvedPos)
      throw new Error('Position is not resolvable in the current document');

    const index = Position.offsetToIndex(
      resolvedPos.parent,
      resolvedPos.offset
    );

    if (index !== undefined) {
      // New node needs to be created
      const node = createTextNode(text);
      this.steps.push(new InsertStep(resolvedPos, node));
    } else {
      // content needs to be inserted in existing node
      // -> use replace step with collapsed selection
    }

    return this;
  }

  /**
   * Adds an {@link RemoveStep} to this transaction, which removes a node from the document.
   * @param node The node to remove, this node needs to be in the current document.
   */
  remove(node: Node) {
    this.steps.push(new RemoveStep(node));
    return this;
  }

  /* replace(selection: Selection, content: Node | Node[]): this;
  replace(from: Position, to: Position, content: Node | Node[]): this;
  replace(
    from: Selection | Position,
    to: Position | Node | Node[],
    content?: Node | Node[]
  ) {
    let selection: Selection;
    if (content) {
      selection = Selection.from(from as Position, to as Position);
      content = content as Node | Node[];
    } else {
      selection = from as Selection;
      content = to as Node | Node[];
    }

    if (!Array.isArray(content)) content = [content];
    // create step
    return this;
  } */

  // Maybe enforce no changes after applying transaction
  /**
   * Calls the `apply` function on the linked editor state, which adds this transaction to the editor state.
   * After calling this or the function on the editor state, changes to this transaction are not allowed.
   */
  apply() {
    return this.state.apply(this);
  }

  undo() {
    return this.state.undo(this);
  }
}
