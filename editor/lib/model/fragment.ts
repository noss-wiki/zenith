import type { Node } from '../Node';

export class Fragment {
  readonly nodes: Node[];

  get size(): number {
    if (this.nodes.length === 0) return 1;

    let size = 0;
    for (const [child, i] of this.iter()) size += child.nodeSize;
    return size;
  }

  constructor(content: Node[]) {
    this.nodes = content;
  }

  // TODO: Maybe make it more difficult to accidentaly use this function?
  /**
   * NOTE: This function should not be called directly, but rather via an `InsertStep`.
   *
   * Inserts `node` at `index` in this fragment.
   * @param node The node or nodes to insert
   * @param index The index where to insert. Leave empty or undefined to insert at the end, or use a negative number to insert with offset from the end. If this value is out of bounds the value will be clamped.
   * @internal
   */
  insert(node: Node | Node[] | Fragment, index?: number) {
    if (node instanceof Fragment) node = node.nodes;
    const nodes: readonly Node[] = Array.isArray(node) ? node : [node];

    let i =
      index === undefined
        ? this.nodes.length
        : index >= 0
        ? index
        : this.nodes.length + index;

    // Clamp value
    if (i > this.nodes.length) i = this.nodes.length;
    else if (i < -this.nodes.length) i = -this.nodes.length;

    this.nodes.splice(i, 0, ...nodes);
  }

  /**
   * Checks if `other` is equal to this fragment
   * @param other The fragment to check
   */
  eq(other: Fragment): boolean {
    if (this === other) return true;
    else if (this.nodes.length !== other.nodes.length) return false;

    for (const [node, i] of this.iter())
      if (!node.eq(other.nodes[i])) return false;

    return true;
  }

  /**
   * Iterate over all nodes, yields an array with first item the node, and second item the index.
   */
  *iter(): Generator<[Node, number], void, unknown> {
    for (let i = 0; i < this.nodes.length; i++) yield [this.nodes[i], i];
  }
}
