import type { Node } from './node';

export type PositionLike = number | RelativePosition | Position;

type RelativePositionLocation =
  | 'before'
  | 'after'
  | 'childIndex'
  | 'childOffset';

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
    const locate = locateNode(document, this.anchor);
    if (!locate) return;

    const parent = locate.steps[locate.steps.length - 2];
    const found = locate.steps[locate.steps.length - 1];
    let offset = 0;

    if (this.location === 'after' || this.location === 'before') {
      if (found.node === locate.document)
        throw new Error(
          "Can't resolve a position before or after the document node"
        );

      if (found.index > 0)
        for (const [child, i] of parent.node.content.iter())
          if (i === found.index) break;
          else offset += child.nodeSize;

      if (this.location === 'after') offset += this.anchor.nodeSize;

      return new Position(document, found.depth, parent.node, offset, locate);
    } else if (
      this.location === 'childIndex' ||
      this.location === 'childOffset'
    ) {
      if (this.location === 'childIndex')
        offset = Position.indexToOffset(this.anchor, this.offset);
      else offset = this.offset!;

      return new Position(
        document,
        found.depth + 1,
        this.anchor,
        offset,
        locate
      );
    }
  }
}

export class Position {
  constructor(
    /**
     * The document this position was resolved in
     */
    readonly document: Node,
    /**
     * The depth the position is relative to the document, 0 means it is the document, 1 means it is a direct chid of the document, etc.
     */
    readonly depth: number,
    /**
     * The parent node of this position
     */
    readonly parent: Node,
    /**
     * The offset this position has into its parent node
     */
    readonly offset: number,
    /**
     * Optionally the result from the `locateNode` function, if used.
     * This reduces overhead when trying to get more info about the node tree.
     */
    readonly steps?: LocateData
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

export interface LocateData {
  document: Node;
  steps: LocateStep[];
}

export interface LocateStep {
  node: Node;
  /**
   * The depth this node is at, 0 means it is the document, 1 means it is a direct child of the document, etc.
   */
  depth: number;
  /**
   * The index this node has in its parents content
   */
  index: number;
}

/**
 * Returns the positions `LocateData` or recalculates if not available.
 * May still return undefined if recalculation failed
 */
export function calculateSteps(pos: Position) {
  if (pos.steps) return pos.steps;
  const locate = locateNode(pos.document, pos.parent);
  // To reduce overhead if calling multiple times on same position
  // @ts-ignore
  pos.steps = locate;
  return locate;
}

/**
 * Performs a breath-first search on the document to try to find the provided node
 * @param document The document node to search in
 * @param node The node to search for
 * @returns Info about the node if found, else it returns undefined
 */
export function locateNode(document: Node, node: Node): LocateData | undefined {
  if (document === node) {
    const step = {
      depth: 0,
      index: 0,
      node: document,
    };
    return {
      document,
      steps: [step],
    };
  }
  const res = bfsSteps(document, 0, 0, node);
  if (res) return { document, steps: res };
}

function bfsSteps(
  node: Node,
  nodeIndex: number,
  depth: number,
  search: Node
): LocateStep[] | undefined {
  let a: [Node, number][] = [];

  for (const [child, i] of node.content.iter()) {
    if (search === child)
      return [
        { depth, node, index: nodeIndex },
        { depth: depth + 1, node: child, index: i },
      ];
    else a.push([child, i]);
  }

  for (const [c, i] of a) {
    const res = bfsSteps(c, i, depth + 1, search);
    if (res) {
      res.unshift({
        depth: depth,
        node,
        index: nodeIndex,
      });
      return res;
    }
  }
}
