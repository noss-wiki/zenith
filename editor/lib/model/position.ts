import type { Node } from '../Node';

export type PositionLike = number | RelativePosition | Position;

type RelativePositionLocation =
  | 'before'
  | 'after'
  | 'childIndex'
  | 'childOffset';

export interface ResolvedPosData {
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
}

export class RelativePosition {
  private offset: number = 0;

  constructor(
    readonly anchor: Node,
    private readonly location: RelativePositionLocation,
    offset?: number
  ) {
    if (offset) this.offset = offset;
    else if (location === 'childIndex')
      this.offset = anchor.content.nodes.length;
    else if (location === 'childOffset') this.offset = anchor.content.size;
  }

  resolve(document: Node): Position | undefined {
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

      return new Position(document, found.depth, found.parent, offset);
    } else if (
      this.location === 'childIndex' ||
      this.location === 'childOffset'
    ) {
      if (this.location === 'childIndex')
        offset = Position.indexToOffset(this.anchor, this.offset);
      else offset = this.offset!;

      return new Position(document, found.depth + 1, this.anchor, offset);
    }
  }
}

export class Position {
  constructor(
    readonly document: Node,
    readonly depth: number,
    readonly parent: Node,
    readonly offset: number
  ) {}

  // static methods
  static resolve(document: Node, pos: PositionLike): Position | undefined {
    if (pos instanceof Position) return pos;
    else if (pos instanceof RelativePosition) return pos.resolve(document);

    // resolve absolute position (number) to document
  }

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
    return new RelativePosition(anchor, 'before');
  }

  /**
   * Creates a position that resolves after `anchor`
   */
  static after(anchor: Node) {
    return new RelativePosition(anchor, 'after');
  }

  /**
   * Creates a position that resolves as a child of `anchor` at index `index`, this is guaranteed to resolve as a direct child of the `anchor` (it cannot cut an existing node in half)
   * @param index The index where to resolve, leave empty for last item, and negative index to start from the last child
   */
  static child(anchor: Node, index?: number) {
    return new RelativePosition(anchor, 'childIndex', index);
  }

  /**
   * Creates a position that resolves as a child of `anchor` at offset `offset`
   * @param offset The offset into the parent
   */
  static offset(anchor: Node, offset: number) {
    return new RelativePosition(anchor, 'childOffset', offset);
  }

  // TODO: Figure out how to implement to and from json, as we need a reference to the document node (probably via the id, and create a function that creates or finds a node with same id in document)
}

export interface IndexPosData {
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

/**
 * Performs a breath-first search on the document to try to find the provided node
 * @param document The document node to search in
 * @param node The node to search for
 * @returns Info about the node if found, else it returns undefined
 */
export function locateNode(
  document: Node,
  node: Node
): IndexPosData | undefined {
  if (document === node)
    return { document, depth: 0, parent: document, index: 0 };
  const res = bfs(document, node, 1);
  if (res) return { document, ...res };
}

function bfs(
  node: Node,
  search: Node,
  depth: number
): Omit<IndexPosData, 'document'> | undefined {
  let a = [];

  for (const [child, i] of node.content.iter())
    if (search === child) return { depth, parent: node, index: i };
    else a.push(child);

  for (const c of a) {
    const res = bfs(c, search, depth + 1);
    if (res) return res;
  }
}
