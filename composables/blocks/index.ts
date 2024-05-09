import type {
  InputData,
  InputContent,
  NodeInputContent,
  AdvancedInputContent,
  ImportData,
  BlockFormat,
  BlockSelection,
} from './data';
import type { ExportReason } from './hooks';

export type { BlockInstance, BlockInstanceInteractable } from './instance';
export { instances } from './instance';
export * from './templates';

export type Category = 'simple_text' | 'list' | 'decorative_text';
export const categories: Category[] = [
  'simple_text',
  'list',
  'decorative_text',
];

export interface BlockDescription {
  /**
   * The name that will be displayed to the user, e.g. in the commands menu
   */
  readonly name: string;
  /**
   * The description that will be displayed to the user, e.g. in the commands menu
   */
  readonly description: string;
  /**
   * The name of the block, needs to be unique.
   * This is what will be used as classname, etc.
   */
  readonly type: string;
  /**
   * The block will be sorted under this category in e.g. the commands menu
   */
  readonly category: Category;
  /**
   * Defines how many inputs this component has
   */
  readonly inputs: number;
  /**
   * Raw html code for icon, import using `*.svg?raw`
   */
  readonly icon: string;
  /**
   * Specifies what should happen when backspace is pressed and focusOffset is 0
   * - delete; the block will be deleted, if that's allowed by the previous block
   * - text; the block will be turned into a text input, content will be carried
   *
   * @default "delete"
   */
  deleteBehaviour?: 'delete' | 'text';
  /**
   * Specifies what should happen when the next block is deleted
   * - true; this block will carry content of next block
   * - false; this block won't carry and the next block, will stay the same
   *
   * @default true
   */
  deleteNextCarryBehaviour?: boolean;
  /**
   * Specifies what should happen when a new block is inserted, because enter was pressed in this block (not with ctrl+enter)
   * - insert; inserts a new block
   * - text; turns this block into a text input
   *
   * @default "insert"
   */
  insertEmptyBehaviour?: 'insert' | 'text';
  /**
   * Specifies what should happen when a new block is inserted related to the new block's type, because enter was pressed in this block (not with ctrl+enter)
   * - text; the block will be a text input
   * - persistent; the block type will be the same as this one
   *
   * @default "text"
   */
  insertTypeBehaviour?: 'text' | 'persistent';
  // TODO: it should not center to full height when content overflows, instead it should only center to the height of a single layer
  /**
   * Will center the handle to the height of the block, only to be used for single line blocks
   *
   * @default false
   */
  centerHandle?: boolean;
  // TODO: this can probably be removed
  /**
   * - Forwards means that content from this block can be carried to previous.
   * - Backwards means that content from next block can be carried to this block.
   *
   * @default "both"
   */
  carry?: 'forwards' | 'backwards' | 'both';
  /**
   * Whether or not this block allows you to move into it with the arrow keys,
   * e.g. you are at the end of the previous block and press arrow right,
   * if this value is true it will move into the first input of the block,
   * if it is manual you will have to define its functionality with the hook and false simply disables this functionality.
   *
   * @default true
   */
  arrows?: boolean;
}

export type ResolvedBlockDescription = Readonly<Required<BlockDescription>>;
export interface BlockDescriptionDefaults extends BlockDescription {
  readonly deleteBehaviour: 'delete';
  readonly deleteNextCarryBehaviour: false;
  readonly insertEmptyBehaviour: 'insert';
  readonly insertTypeBehaviour: 'text';
  readonly centerHandle: false;
  readonly carry: 'both';
  readonly arrows: true;
}

export interface InputRegisterHandler {
  ref: Ref<HTMLElement | undefined>;
  getContent<T extends boolean>(
    nodes?: T
  ): T extends true ? NodeInputContent[] : InputData;
  /**
   * Handles the focussing of the element, this will only be called after mounting, so you don't have to worry about refs to elements
   */
  focus(char?: number | BlockSelection): void;
  carry(data: InputData): void;
  format(format: BlockFormat): void;

  import(data: ImportData): void;
  /**
   * @param reason What the export will be used for
   * @param char Will be the char at which to carry if reason is `ExportReason.carry`
   */
  export(reason: ExportReason, char?: number): InputData;
}

export interface InputRegister extends InputRegisterHandler {
  index: number;
}
