export * from './components';

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
  name: string;
  /**
   * The description that will be displayed to the user, e.g. in the commands menu
   */
  description: string;
  /**
   * The name of the block, needs to be unique.
   * This is what will be used as classname, etc.
   */
  type: string;
  /**
   * The block will be sorted under this category in e.g. the commands menu
   */
  category: Category;

  /**
   * Raw html code for icon, import using `*.svg?raw`
   */
  icon: string;

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
  arrows?: true | false | 'manual';
}

export interface InputRegisterHandler {
  content?: string;

  getContent(): string;
  setContent(content: string): void;
  /**
   * Handles the focussing of the element, this will only be called after mounting, so you don't have to worry about refs to elements
   */
  focus(char?: number): void;

  carry(content: string): void;
}

interface InputRegister extends InputRegisterHandler {
  index: number;
}

export const instances: BlockInstanceInteractable[] = [];

export class BlockInstance {
  meta: Required<BlockDescription>;
  id: string;

  // watch this to move handle
  hover = ref(false);

  inputs: InputRegister[] = [];

  _attached?: HTMLElement;

  #interactable: BlockInstanceInteractable;

  constructor(meta: BlockDescription) {
    meta.carry ??= 'both';
    this.meta = meta as Required<BlockDescription>;
    this.id = Math.random().toString(36).slice(2);

    this.#interactable = new BlockInstanceInteractable(this);
    instances.push(this.#interactable);
  }

  _input<Additional>(handler: InputRegisterHandler & Additional): number {
    if (!this.inputs)
      throw new Error(
        'The instance.input has incorrect this argument, function needs to be passed as an anonymous function or manually bounded, e.g. (e) => instance.input(e) or instance.input.bind(instance)'
      );
    const val: InputRegister = {
      index: this.inputs.length,
      ...handler,
    };
    this.inputs.push(val);
    return val.index;
  }
}

/**
 * This will be attached to a BlockInstance, and it will act as a way for the internals to call instance functions and hooks
 */
export class BlockInstanceInteractable {
  instance: BlockInstance;

  constructor(instance: BlockInstance) {
    this.instance = instance;
  }

  /**
   * Attaches an element to this instance, this needs to be done as soon as the element is inserted in the dom.
   * It is also needed for most functions to work
   */
  attach(blockRoot: HTMLElement) {
    this.instance._attached = blockRoot;
  }

  focus(char?: number) {
    const i = this.instance.inputs.length - 1;
    if (i < 0) return;

    this.instance.inputs[i].focus(char);
  }

  carry(content: string) {
    const i = this.instance.inputs.length - 1;
    if (i < 0) return;

    this.instance.inputs[i].carry(content);
  }
}