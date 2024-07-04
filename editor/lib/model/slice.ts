import type { Node } from './node';
import { Position } from './position';
import { Fragment } from './fragment';

export class Slice {
  /**
   * @param content The content of this slice
   * @param openStart The offset in the content at the start where the slice starts
   * @param openEnd The offset in the content at the end where the slice ends
   * @param document The document the content originated from, leave empty if this slice is not part of a document
   */
  constructor(
    readonly content: Fragment,
    readonly openStart: number,
    readonly openEnd: number,
    readonly document?: Node
  ) {}

  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }

  eq(other: Slice) {
    return (
      this.content.eq(other.content) &&
      this.openStart === other.openStart &&
      this.openEnd === other.openEnd
    );
  }

  // static methods
  static between(from: Position, to: Position) {
    // TODO: Improve performance here (get depth of common parent and use .start and .end methods on position to get offsets)
    const common = from.commonParent(to);
    const doc = from.document;

    const fromOffset = from.toAbsolute();
    const startOffset = Position.child(common, 0).resolve(doc)?.toAbsolute();
    if (
      fromOffset === undefined ||
      startOffset === undefined ||
      fromOffset < startOffset
    )
      return;

    const toOffset = to.toAbsolute();
    const endOffset = Position.child(common).resolve(doc)?.toAbsolute();
    if (
      toOffset === undefined ||
      endOffset === undefined ||
      toOffset > endOffset
    )
      return;

    return new Slice(
      common.content,
      fromOffset - startOffset,
      endOffset - toOffset,
      doc
    );
  }
}
