import type {
  BlockDescription,
  BlockDescriptionDefaults,
  InputRegister,
  InputRegisterHandler,
} from '.';
import { Eventfull } from '../classes/eventfull';

export const instances: BlockInstanceInteractable[] = [];

export class BlockInstance extends Eventfull {
  static readonly meta: Readonly<Required<BlockDescription>>;
  readonly meta: Readonly<Required<BlockDescription>>;

  id: string;

  // watch this to move handle
  hover = ref(false);

  inputs: InputRegister[] = [];

  _attached?: HTMLElement;

  #interactable: BlockInstanceInteractable;

  constructor() {
    super();
    this.meta = (<typeof BlockInstance>this.constructor).meta;

    this.id = Math.random().toString(36).slice(2);
    this.#interactable = new BlockInstanceInteractable(this);
    instances.push(this.#interactable);
  }

  mount() {}

  unmount() {
    super.unmount();
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

type Defaults<T> = Omit<BlockDescriptionDefaults, keyof T> & T;

/**
 * Adds defaults to every optional value of the description.
 * None specified values still get all the options, instead of defaults as I haven't figured out how to do this in typescript.
 */
export function description<T extends BlockDescription>(desc: T): Defaults<T> {
  desc.carry ??= 'both';
  desc.arrows ??= true;
  return desc as Defaults<T>;
}
