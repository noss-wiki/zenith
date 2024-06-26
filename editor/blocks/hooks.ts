export enum FocusReason {
  /**
   * When this block is created and inserted in the editor.
   */
  Insert = 'insert',
  /**
   * When this block is duplicated
   */
  Duplicate = 'duplicate',
  /**
   * When a block was turned into this block
   */
  TurnInto = 'turnInto',
  /**
   * When the next block is deleted and this block gets focussed because of it.
   */
  Delete = 'delete',
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

export enum ExportReason {
  /**
   * When the content of this block is saved.
   */
  Save = 'save',
  /**
   * When the block gets duplicated.
   */
  Duplicate = 'duplicate',
  /**
   * When this block is transformed to another block.
   */
  TurnInto = 'turninto',
  /**
   * Simply to check if this block is empty
   */
  CheckEmpty = 'checkEmpty',
  Carry = 'carry',
}
