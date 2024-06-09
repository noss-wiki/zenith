import type { Node } from '../Node';

export class Fragment {
  nodes: Node[];

  constructor(content: Node[]) {
    this.nodes = content;
  }

  /**
   * Inserts `node` at `index` in this fragment, if a node is already inserted, and thus has a parent, it will throw an error.
   * @param node The node or nodes to insert
   * @param index The index where to insert. Leave empty or undefined to insert at the end, or use a negative number to insert with offset from the end.
   * If this value is out of bounds the value will be clamped.
   */
  insert(node: Node | Node[], index?: number) {
    // Check if node is already inserted
    const nodes: readonly Node[] = Array.isArray(node) ? node : [node];
    /* for (const n of nodes) {
      if (n.parent !== null)
        throw new Error('Node already has a parent, at Fragment.insert');
    } */

    let i =
      index === undefined
        ? this.nodes.length - 1
        : index >= 0
        ? index
        : this.nodes.length + index;

    // Clamp value
    if (i >= this.nodes.length) i = this.nodes.length - 1;
    else if (i <= -this.nodes.length) i = -this.nodes.length + 1;

    this.nodes.splice(i, 0, ...nodes);
  }

  /**
   * Iterate over all nodes, yields an array with first item the node, and second item the index.
   */
  *iter(): Generator<[Node, number], void, unknown> {
    for (let i = 0; i < this.nodes.length; i++) yield [this.nodes[i], i];
  }
}
