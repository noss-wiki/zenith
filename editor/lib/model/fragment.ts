import type { Node, NodeJSON } from './node';
import { Position } from './position';
import type { Slice } from './slice';

export class Fragment {
  nodes: Node[];

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
   * **NOTE**: This modifies this node's content, it should not be called directly on a node that is in a document, but rather via a transaction to preserve history.
   *
   * Inserts `node` at `index` in this fragment.
   * @param node The node or nodes to insert
   * @param index The index where to insert. Leave empty or undefined to insert at the end, or use a negative number to insert with offset from the end. If this value is out of bounds the value will be clamped.
   * @returns A boolean indicating if the node has been inserted.
   */
  insert(node: Node | Node[] | Fragment, index?: number): boolean {
    // TODO: Verify if content is allowed before inserting
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
    return true;
  }

  /**
   * **NOTE**: This modifies this node's content, it should not be called directly on a node that is in a document, but rather via a transaction to preserve history.
   *
   * @param node The node to remove
   * @returns A boolean indicating if the node has been removed.
   */
  remove(node: Node): boolean {
    // TODO: Verify if content is allowed before removing
    const index = this.nodes.indexOf(node);
    if (index === -1) return false;
    this.nodes.splice(index, 1);
    return true;
  }

  /**
   * **NOTE**: This modifies this node's content, it should not be called directly on a node that is in a document, but rather via a transaction to preserve history.
   *
   * Changes this fragment's content to only include the content between the given positions.
   * This does not cut non-text nodes in half, meaning if the starting position is inside of a node, that entire node is included.
   *
   * @param from The starting position where to cut.
   * @param to The end position, leave empty to cut until the end.
   */
  cut(from: number, to: number = this.size): boolean {
    if (from === 0 && to === this.size) return true;
    else if (from > to) return false;
    else if (from < 0 || to < 0 || to > this.size) return false;

    const res: Node[] = [];
    let pos = 0;
    for (const [c] of this.iter())
      if (c.nodeSize < from - pos) {
        pos += c.nodeSize;
        continue;
      } else if (pos > to) break;
      else {
        if (c.text !== null)
          c.cut(Math.max(0, from - pos), Math.min(c.text!.length, to - pos));
        else
          c.cut(
            Math.max(0, from - pos - 1),
            Math.min(c.content.size, to - pos - 1)
          );

        res.push(c);
        pos += c.nodeSize;
      }

    this.nodes = res;
    return true;
  }

  /**
   * **NOTE**: This modifies this node's content, it should not be called directly on a node that is in a document, but rather via a transaction to preserve history.
   *
   * @param parent The parent node of this fragment, this is used to check if the slice's content conforms to the parent's schema.
   */
  replace(from: number, to: number, slice: Slice, parent: Node): boolean {
    // TODO: Verify if content of slice conforms to this parent node's content
    const $from = parent.resolve(from);
    const $to = parent.resolve(to);

    if (!$from || !$to) return false;
    else if (
      slice.openStart > $from.depth ||
      slice.openEnd > $to.depth ||
      $from.depth - $to.depth !== slice.openStart - slice.openEnd ||
      $from.depth - slice.openStart < 0
    )
      return false;

    // The node where to insert the slice, accounting for the depths
    const sliceDepthNode = $from.node(-slice.openStart);

    return false;
  }

  // TODO: dfs or bfs?

  /**
   * Converts an offset to an index in this fragment
   */
  offsetToIndex(offset: number) {
    let pos = 0;

    for (const [c, i] of this.iter()) {
      pos += c.nodeSize;
      if (pos >= offset) return { node: c, index: i, offset: pos - offset };
    }

    return {
      node: this.nodes[this.nodes.length - 1],
      index: this.nodes.length - 1,
      offset: pos - offset,
    };
  }

  /**
   * Checks if this fragment contains `node`.
   * It does this by performing a breath-first search in the descending nodes.
   * This function may be quite expensive on large nodes.
   */
  contains(node: Node): boolean {
    let queue: Node[] = [];

    for (const [c] of this.iter())
      if (c === node) return true;
      else queue.push(c);

    for (const c of queue) if (c.content.contains(node) === true) return true;

    return false;
  }

  /**
   * Calculates the offset `node` has into this fragment.
   * Call this on the document node to get the absolute position of a node.
   * @returns The offset if found, or undefined if not found.
   */
  offset(node: Node): number | undefined {
    let queue: [Node, number][] = [];
    let offset = 0;

    for (const [c] of this.iter()) {
      if (c === node) return offset;
      else queue.push([c, offset]);

      offset += c.nodeSize;
    }

    for (const [c, o] of queue) {
      const res = c.content.offset(node);
      if (res === undefined) continue;
      return o + res + 1;
    }
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
   * Creates a deep copy of this fragment.
   * It does this by recursively calling this method on every child node.
   */
  copy(): Fragment {
    const children: Node[] = [];
    for (const [c] of this.iter()) children.push(c.copy());
    return new Fragment(children);
  }

  // TODO: Maybe also just implement [Symbol.iterator] to avoid having to call iter()
  /**
   * Iterate over all nodes, yields an array with first item the node, and second item the index.
   */
  *iter(): Generator<[Node, number], void, unknown> {
    for (let i = 0; i < this.nodes.length; i++) yield [this.nodes[i], i];
  }

  toJSON(): FragmentJSON {
    return {
      nodes: this.nodes.map((e) => e.toJSON()),
    };
  }
}

export type FragmentJSON = {
  nodes: NodeJSON[];
};
