import type { InputData, AdvancedInputContent, ImportData } from './data';
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
   * Will center the handle to the height of the block, only to be used for single line blocks
   */
  centerHandle?: boolean;
  /**
   * - Forwards means that content from this block can be carried to previous.
   * - Backwards means that content from next block can be carried to this block.
   * @default "both"
   */
  carry?: 'forwards' | 'backwards' | 'both';
  /**
   * Whether or not this block allows you to move into it with the arrow keys,
   * e.g. you are at the end of the previous block and press arrow right,
   * if this value is true it will move into the first input of the block,
   * if it is manual you will have to define its functionality with the hook and false simply disables this functionality.
   * @default true
   */
  arrows?: boolean;
}

export type ResolvedBlockDescription = Readonly<Required<BlockDescription>>;
export interface BlockDescriptionDefaults extends BlockDescription {
  readonly centerHandle: false;
  readonly carry: 'both';
  readonly arrows: true;
}

export interface InputRegisterHandler {
  ref: Ref<HTMLElement | undefined>;
  getContent(): InputData;
  /**
   * Handles the focussing of the element, this will only be called after mounting, so you don't have to worry about refs to elements
   */
  focus(char?: number): void;
  carry(content: string): void;

  import(data: ImportData): void;
  export(reason: ExportReason): InputData;
}

export interface InputRegister extends InputRegisterHandler {
  index: number;
}
