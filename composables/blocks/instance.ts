import type { BlockDescription, InputRegister, InputRegisterHandler } from '.';

export const instances: BlockInstanceInteractable[] = [];

export class BlockInstance {
  static readonly meta: Readonly<Required<BlockDescription>>;
  id: string;

  // watch this to move handle
  hover = ref(false);

  inputs: InputRegister[] = [];

  _attached?: HTMLElement;

  #interactable: BlockInstanceInteractable;

  constructor() {
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

export function description(desc: BlockDescription) {
  desc.carry ??= 'both';
  desc.arrows ??= true;
  return desc as Required<BlockDescription>;
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
