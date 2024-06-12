import type { Node } from '../Node';

type RelativePosition = 'before' | 'after' | 'childIndex' | 'childOffset';

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
  readonly anchor: Node;
  resolved = false;

  private resolvedResult: ResolvedPosData | undefined;
  private location: RelativePosition | undefined;
  private offset?: number;

  constructor(anchor: Node, location?: RelativePosition, childIndex?: number) {
    this.anchor = anchor;
    this.location = location;
    this.offset = childIndex;
  }

  resolve(document: Node): ResolvedPosData | undefined {
    const found = locateAnchor(document, this.anchor);
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

      this.resolvedResult = {
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

      this.resolvedResult = {
        depth: found.depth + 1,
        parent: this.anchor,
        offset,
        document,
      };
    }

    this.resolved = true;
    return this.resolvedResult;
  }

  // static methods
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

  // init methods
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
   * Creates a position that resolves as a child of `anchor`, at index `childIndex`, this is guaranteed to resolve as a direct child of the `anchor` (it cannot cut an existing node in half)
   * @param index The index where to resolve, leave empty for last item, and negative index to start from the last child
   */
  static child(anchor: Node, index?: number) {
    return new Position(anchor, 'childIndex', index);
  }
  static offset(anchor: Node, offset: number) {
    return new Position(anchor, 'childOffset', offset);
  }
}

function locateAnchor(
  document: Node,
  anchor: Node
): { parent: Node; depth: number; index: number } | undefined {
  if (document === anchor) return { depth: 0, parent: document, index: 0 };
  else return bfs(document, anchor, 1);
}

function bfs(
  node: Node,
  search: Node,
  depth: number
): { parent: Node; depth: number; index: number } | undefined {
  let a = [];

  for (const [child, i] of node.content.iter())
    if (search === child) return { depth, parent: node, index: i };
    else a.push(child);

  for (const c of a) {
    const res = bfs(c, search, depth + 1);
    if (res) return res;
  }
}
