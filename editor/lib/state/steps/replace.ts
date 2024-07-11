import type { Node } from '../../model/node';
import type { PositionLike } from '../../model/position';
import { Position } from '../../model/position';
import { Slice } from '../../model/slice';
import { Step } from '../step';

export class ReplaceStep extends Step {
  id = 'replace';

  private $from?: Position;
  private $to?: Position;

  constructor(
    /**
     * The start position in the document where to start replacing.
     */
    readonly from: PositionLike,
    /**
     * The end position in the document where to stop replacing.
     */
    readonly to: PositionLike,
    /**
     * The content to replace the selection with.
     */
    readonly slice: Slice
  ) {
    super();
  }

  apply(boundary: Node): boolean {
    this.$from ??= Position.resolve(boundary, this.from);
    this.$to ??= Position.resolve(boundary, this.to);
    if (!this.$from || !this.$to) return false;
    else if (
      this.$from.depth - this.$to.depth !==
        this.slice.openStart - this.slice.openEnd ||
      this.$from.depth - this.slice.openStart < 0
    )
      return false;

    const parent = this.$from.node(this.$from.depth - this.slice.openStart);
    // TODO: Verify if content is allowed before replacing

    return false;
  }

  undo(boundary: Node): boolean {
    // Can be assumed that the slice fit into the content
    return false;
  }
}
