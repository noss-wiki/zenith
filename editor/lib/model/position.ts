import type { Node } from '../Node';

type RelativePosition = 'before' | 'after' | 'childIndex' | 'childOffset';

export interface FoundPosData {
  document: Node;
  /**
   * The parent node of this position
   */
  parent: Node;
  /**
   * The depth the parent is relative to the document root
   */
  depth: number;
  /**
   * The index of the node in the parent's content
   */
  index: number;
}

interface ResolvedPosData {
  document: Node;
  /**
   * The depth the parent is relative to the document root
   */
  depth: number;
  /**
   * The parent node of this position
   */
  parent: Node;
  /**
   * The offset this position has into its parent node.
   */
  offset: number;
  /**
   * The index of the anchor node in the parent's content
   */
  /* index: number; */
}

export class Position {
  resolved = false;
  result?: ResolvedPosData;
  private offset: number;

  constructor(
    readonly anchor: Node,
    readonly location?: RelativePosition,
    childIndex?: number
  ) {
    if (childIndex) this.offset = childIndex;
    else this.offset = anchor.content.nodes.length;
  }

  resolve(document: Node): ResolvedPosData | undefined {
    const found = locateNode(document, this.anchor);
    if (!found) return;

    // calculate offset
    let offset = 0;

    if (this.location === 'after' || this.location === 'before') {
      // initial offset
      if (found.index > 0)
        for (const [child, i] of found.parent.content.iter())
          if (i === found.index) break;
          else offset += child.nodeSize;

      if (this.location === 'after') offset += this.anchor.nodeSize;

      this.result = {
        ...found,
        offset,
        document,
      };
    } else if (
      this.location === 'childIndex' ||
      this.location === 'childOffset'
    ) {
      if (this.location === 'childIndex')
        offset = Position.indexToOffset(this.anchor, this.offset);
      else offset = this.offset!;

      this.result = {
        depth: found.depth + 1,
        parent: this.anchor,
        offset,
        document,
      };
    }

    this.resolved = true;
    return this.result;
  }

  // static methods
  /**
   * Converts an index to an offset in a node
   * @param parent The node to use as parent
   * @param index The index to convert to an offset
   */
  static indexToOffset(parent: Node, index?: number) {
    if (!index) index = parent.content.nodes.length;
    else if (index < 0) index = parent.content.nodes.length + index;

    if (index === 0) return 0;

    let offset = 0;
    for (const [child, i] of parent.content.iter())
      if (i === index) break;
      else offset += child.nodeSize;

    return offset;
  }

  /**
   * Tries to convert an offset to an index, this can only happen in the offset is between two nodes. Else it will return undefined
   * @param parent The node to use as parent
   * @param offset The offset to convert to an index
   */
  static offsetToIndex(parent: Node, offset: number): number | undefined {
    if (offset === 0) return 0;

    let _offset = 0; //
    for (const [child, i] of parent.content.iter())
      if (offset === _offset) return i;
      else if (_offset > offset) return undefined;
      else _offset += child.nodeSize;

    if (offset === _offset) return parent.content.nodes.length;
  }

  // static init methods
  /**
   * Creates a position that resolves before `anchor`
   */
  static before(anchor: Node) {
    return new Position(anchor, 'before');
  }

  /**
   * Creates a position that resolves after `anchor`
   */
  static after(anchor: Node) {
    return new Position(anchor, 'after');
  }

  /**
   * Creates a position that resolves as a child of `anchor` at index `index`, this is guaranteed to resolve as a direct child of the `anchor` (it cannot cut an existing node in half)
   * @param index The index where to resolve, leave empty for last item, and negative index to start from the last child
   */
  static child(anchor: Node, index?: number) {
    return new Position(anchor, 'childIndex', index);
  }

  /**
   * Creates a position that resolves as a child of `anchor` at offset `offset`
   * @param offset The offset into the parent
   */
  static offset(anchor: Node, offset: number) {
    return new Position(anchor, 'childOffset', offset);
  }
}

/**
 * Performs a breath-first search on the document to try to find the provided node
 * @param document The document node to search in
 * @param node The node to search for
 * @returns Info about the node if found, else it returns undefined
 */
export function locateNode(
  document: Node,
  node: Node
): FoundPosData | undefined {
  if (document === node)
    return { document, depth: 0, parent: document, index: 0 };
  const res = bfs(document, node, 1);
  if (res) return { document, ...res };
}

function bfs(
  node: Node,
  search: Node,
  depth: number
): Omit<FoundPosData, 'document'> | undefined {
  let a = [];

  for (const [child, i] of node.content.iter())
    if (search === child) return { depth, parent: node, index: i };
    else a.push(child);

  for (const c of a) {
    const res = bfs(c, search, depth + 1);
    if (res) return res;
  }
}
