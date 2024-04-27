export enum FocusReason {
  /**
   * When this block is created and inserted in the editor.
   */
  Insert,
  /**
   * When a previous block is deleted and this block gets focussed because of it.
   */
  Delete,
  /**
   * When the last block is deleted and this is the new last block.
   */
  DeleteLast,
  /**
   * When arrow keys were used from the previous block to travel (downwards) into this block.
   *
   * Keys: Down, Right
   */
  ArrowNext,
  /**
   * When arrow keys were used from the next block to travel (upwards) into this block.
   *
   * Keys: Up, Left
   */
  ArrowPrevious,
}
