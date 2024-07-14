import type { Node, NodeJSON } from './node';
import { Position } from './position';
import type { Slice } from './slice';

export class Fragment {
  nodes: Node[];

  get size(): number {
    // TODO: Shouldn't this be 0?
    if (this.nodes.length === 0) return 1;

    let size = 0;
    for (const [child, i] of this.iter()) size += child.nodeSize;
    return size;
  }

  constructor(content: Node[]) {
    this.nodes = content;
  }

  private resolveIndex(index?: number): number {
    if (!index) return this.nodes.length - 1;
    else if (index < 0) return this.nodes.length + index;
    else return index;
  }

  private validIndex(index: number): boolean {
    return index >= 0 && index < this.nodes.length;
  }

  child(index: number): Node {
    return this.nodes[index];
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

    let i = this.resolveIndex(index);
    if (!this.validIndex(i)) return false;

    this.nodes.splice(i, 0, ...nodes);
    return true;
  }

  /**
   * **NOTE**: This modifies this node's content, it should not be called directly on a node that is in a document, but rather via a transaction to preserve history.
   *
   * Removes a single node from this content.
   *
   * @param node The node to remove
   * @returns A boolean indicating if the node has been removed.
   */
  remove(node: Node): boolean;
  /**
   * **NOTE**: This modifies this node's content, it should not be called directly on a node that is in a document, but rather via a transaction to preserve history.
   *
   * Removes the content between the given positions.
   *
   * @param from The start, from where to start removing
   * @param to The end, to where to remove
   */
  remove(from: number, to: number): boolean;
  remove(node: Node | number, to?: number): boolean {
    // TODO: Verify if content is allowed before removing
    if (typeof node !== 'number') {
      const index = this.nodes.indexOf(node);
      if (index === -1) return false;
      this.nodes.splice(index, 1);
      return true;
    } else {
      return false;
    }
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

    this.nodes.length = 0;
    this.nodes.push(...res);
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
    const fromDepthParent = $from.node(-slice.openStart);
    const toDepthParent = $to.node(-slice.openEnd);

    // cases:
    // - [x] slice is empty
    // - [x] slice is flat (no openStart and openEnd) and parent is the same
    // - [ ] slice

    if (slice.size === 0) {
      // slice is empty, so only remove the content between from and to
      // sliceDepthNode.remove($from.relative(-slice.openStart) + 1, $to.relative(-slice.openEnd) - 1); prob more efficient
      parent.remove(from, to);
      // TODO: check for success
      return true;
    } else if (
      slice.openStart === 0 &&
      slice.openEnd === 0 &&
      fromDepthParent === toDepthParent
    ) {
      // slice is flat and the parent is the same
      const posParent = $from.parent;
      const outer = posParent.copy().cut($to.offset);
      posParent.cut(0, $from.offset).content.insert(slice.content);
      posParent.content.insert(outer);
      // TODO: check for success
      return true;
    }

    return false;
  }

  /**
   * **NOTE**: This modifies this node's content, it should not be called directly on a node that is in a document, but rather via a transaction to preserve history.
   *
   * Much simpler version of replace, only replaces a single child.
   * Always use this method over the more complex replace function, because this method is far more efficient.
   *
   * @param node The node to replace the child with.
   * @param index The index where to replace the child. Leave empty or undefined to insert at the end, or use a negative number to insert with offset from the end.
   */
  replaceChild(node: Node, index?: number): boolean {
    const i = this.resolveIndex(index);
    if (!this.validIndex(i)) return false;
    this.nodes[i] = node;
    return true;
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
