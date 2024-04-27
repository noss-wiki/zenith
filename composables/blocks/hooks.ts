export enum FocusReason {
  /**
   * When this block is created and inserted in the editor.
   */
  Insert = 'insert',
  /**
   * When a previous block is deleted and this block gets focussed because of it.
   */
  Delete = 'delete',
  /**
   * When the last block is deleted and this is the new last block.
   */
  DeleteLast = 'deleteLast',
  /**
   * When arrow keys were used from the previous block to travel (downwards) into this block.
   *
   * Keys: Down, Right
   */
  ArrowNext = 'arrowNext',
  /**
   * When arrow keys were used from the next block to travel (upwards) into this block.
   *
   * Keys: Up, Left
   */
  ArrowPrevious = 'arrowPrevious',
}
