import type { Node } from './node';

export type PositionLike = number | RelativePosition | Position;

export type IsPosition<T> = T extends Position ? true : false;

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
    if (typeof offset === 'number') this.offset = offset;
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

      return new Position(
        document,
        found.depth,
        parent.node,
        offset,
        popSteps(locate)
      );
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
    readonly steps: LocateData
  ) {}

  /**
   * Returns the parent node at `depth`.
   */
  node(depth: number) {
    return this.steps.steps[depth].node;
  }

  /**
   * Returns the absolute position, where the parent node at `depth` starts.
   */
  start(depth: number) {
    if (this.steps.steps[depth].pos !== undefined)
      return this.steps.steps[depth].pos!;

    const res = this.document.content.offset(this.node(depth));
    if (!res)
      throw new Error('Failed to get the absolute position of parent node');
    return res;
  }

  /**
   * Returns the absolute position, where the parent node at `depth` ends.
   */
  end(depth: number) {
    return this.start(depth) + this.node(depth).content.size;
  }

  /**
   * Returns the relative offset to `node`.
   * @param node The index of a parent node of this position, or a node in this document.
   * @returns The relative position to node, will be undefined if this position is before `node`. Or undefined if node cannot be resolved in the same document as this position.
   */
  relative(node: Node | number) {
    let pos;
    if (typeof node === 'number') pos = this.start(node);
    else pos = this.document.content.offset(node);
    if (!pos) throw new Error('Failed to resolve node in this document');
    return this.toAbsolute() - pos;
  }

  /**
   * Gets the depth of the deepest common parent between two positions.
   * @returns The depth of the deepest common parent.
   * @throws If the two positions are in different documents.
   */
  commonDepth(pos: Position) {
    const common = findCommonParent(this, pos);
    return common.depth;
  }

  /**
   * Gets the deepest common parent between two positions.
   * @returns The common parent node, or undefind if it failed.
   * @throws If the two positions are in different documents.
   */
  commonParent(pos: Position) {
    const d = this.commonDepth(pos);
    return d === undefined ? d : this.node(d);
  }

  /**
   * Converts this position to an absolute position in the Position's document.
   * @returns The absolute position
   */
  toAbsolute(): number {
    if (this.steps.steps[this.steps.steps.length - 1]?.pos)
      return (
        this.steps.steps[this.steps.steps.length - 1].pos! + this.offset + 1
      );

    let pos = 0;

    for (let i = 1; i < this.steps.steps.length; i++) {
      const parent = this.steps.steps[i - 1];
      const step = this.steps.steps[i];
      if (i > 1) pos += 1; // start tag
      pos += Position.indexToOffset(parent.node, step.index);
    }

    if (pos === 0) return pos + this.offset;
    else return pos + 1 + this.offset;
  }

  // static methods
  static resolve(document: Node, pos: PositionLike): Position | undefined {
    if (pos instanceof Position) return pos;
    else if (pos instanceof RelativePosition) return pos.resolve(document);
    else return Position.absoluteToPosition(document, pos);
  }

  /**
   * Converts an absolute position to a resolved `Position`
   * @param document The document where to resolve the absolute position
   * @param pos The absolute position to resolve
   * @returns The resolved position, or undefined if it failed.
   */
  static absoluteToPosition(document: Node, pos: number): Position | undefined {
    if (pos < 0 || pos > document.nodeSize) return;
    else if (pos === 0)
      return new Position(document, 0, document, 0, {
        document,
        steps: [{ node: document, depth: 0, index: 0 }],
      });

    const steps: LocateStep[] = [];

    interface DeepestFound {
      depth: number;
      parent: Node;
      offset: number;
    }

    const deepestOffset = (
      node: Node,
      depth: number,
      offset: number
    ): DeepestFound | undefined => {
      if (offset === 0) return { depth, parent: node, offset: 0 };
      else if (node.content.nodes.length === 0 && offset === 1)
        return { depth, parent: node, offset: 1 };

      let nodeOffset = 0;
      // TODO: Check if node can hold content before trying to loop over children
      // aka, when a text node is found just subtract the content length, instead of looping over the (non-existent) content
      for (const [c, i] of node.content.iter()) {
        if (offset > c.nodeSize) {
          offset -= c.nodeSize;
          nodeOffset += offset;
          continue;
        } else if (offset === 0)
          return { depth, parent: node, offset: nodeOffset };
        else if (offset === c.nodeSize)
          return { depth, parent: node, offset: nodeOffset + c.nodeSize };

        // this node is a parent of the position, so push it to the stack
        steps.push({ node: c, index: i, depth, pos: pos - offset });
        return deepestOffset(c, depth + 1, offset - 1);
      }

      return;
    };

    steps.push({ node: document, index: 0, depth: 0, pos: 0 });
    const res = deepestOffset(document, 1, pos);
    if (!res) return;

    const locate: LocateData = { document, steps };
    return new Position(document, res.depth, res.parent, res.offset, locate);
  }

  /**
   * Converts a position to an absolute position in the Position's document.
   * @returns The absolute position, or undefined if it failed.
   */
  static positionToAbsolute(pos: Position | number) {
    return typeof pos === 'number' ? pos : pos.toAbsolute();
  }

  /**
   * Converts an index to an offset in a node
   * @param parent The node to use as parent
   * @param index The index to convert to an offset
   */
  static indexToOffset(parent: Node, index?: number) {
    if (index === undefined) index = parent.content.nodes.length;
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

  /**
   * Returns a boolean indicating wheter or not `pos` is a resolved Position
   */
  static is(pos: PositionLike): boolean {
    if (pos instanceof Position) return true;
    else return false;
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
  node: Node;
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
   * The index this node has in its parents content.
   */
  index: number;
  /**
   * The absolute position of the node of this step.
   */
  pos?: number;
}

/**
 * Removes the last step from the result of the `locateNode` function.
 */
function popSteps(data: LocateData) {
  data.steps = data.steps.slice(0, -1);
  return data;
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

// TODO: Returns something else instead of throwing, but include the reason why it failed

/**
 * Tries to find the deepest possible common parent between two positions.
 * @returns The common parent between the two positions, or undefined it failed
 */
function findCommonParent(from: Position, to: Position) {
  if (from.document !== to.document)
    throw new Error(
      'Cannot find common parent between two nodes with different documents'
    );

  // can probably skip depth 0, as it is always the document node
  const depth = findDeepestCommonParent(from, to, 0);
  if (!depth)
    throw new Error(
      'Cannot find common parent between two nodes with different documents'
    );

  return {
    ...depth,
    document: from.document,
  } as IndexPosData;
}

function findDeepestCommonParent(
  from: Position,
  to: Position,
  depth: number
): LocateStep | undefined {
  if (!from.steps!.steps[depth] || !to.steps!.steps[depth]) return undefined;
  else if (from.steps!.steps[depth].node === to.steps!.steps[depth].node) {
    const res = findDeepestCommonParent(from, to, depth + 1);
    if (res) return res;
    else return from.steps!.steps[depth];
  }

  return undefined;
}
