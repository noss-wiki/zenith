import type {
  BlockDescription,
  ResolvedBlockDescription,
  BlockDescriptionDefaults,
  InputRegister,
  InputRegisterHandler,
} from '.';
import type { BlockData, ImportData, InputData } from './data';
import { FocusReason, ExportReason } from './hooks';
import { Logger } from '../classes/logger';
import { Eventfull } from '../classes/eventfull';

export const instances: BlockInstanceInteractable[] = [];

type RegisterType = 'input';
interface Register {
  input: {
    handler: InputRegisterHandler;
    return: {
      index: number;
      deregister: () => void;
    };
  };
}

// TODO: Hooks that get called when the block has multiple inputs (like insert, etc.)
export class BlockInstance extends Eventfull {
  static readonly meta: ResolvedBlockDescription;
  readonly meta: ResolvedBlockDescription;

  id: string;

  _attached?: HTMLElement;
  #interactable: BlockInstanceInteractable;

  inputs: InputRegister[] = [];
  protected logger = new Logger('BlockInstance');
  protected components = [];

  constructor() {
    super();
    this.meta = (<typeof BlockInstance>this.constructor).meta;

    this.id = Math.random().toString(36).slice(2);
    this.#interactable = new BlockInstanceInteractable(this);
    instances.push(this.#interactable);
  }

  /* mount() {} */

  unmount() {
    super.unmount();

    this.inputs = [];
  }

  register(
    type: RegisterType,
    handler: Register[typeof type]['handler']
  ): Register[typeof type]['return'] | void {
    if (!this.meta)
      return this.logger.error(
        'The attach hook has incorrect `this` argument',
        'BlockInstance.attach'
      );

    if (type === 'input') {
      if (this.inputs.length === this.meta.inputs)
        return this.logger.error(
          `Failed to attach input component, this instance already has the provided number of inputs: ${this.meta.inputs}`,
          'BlockInstance.attach'
        );

      const val = {
        index: this.inputs.length,
        ...handler,
      };
      this.inputs.push(val);
      return {
        index: val.index,
        deregister: () => {
          this.inputs.splice(val.index, 1);
        },
      };
    }
  }

  // Hooks
  // TODO: Add hook(s) for carrying and importing content
  // ?TODO: Add result returns to hooks, that indicated whether or not the action was successfull

  /**
   * The hook that gets called when this block needs to be focussed.
   * Default implementation always focuses the first input, if it exists.
   *
   * @param reason The reason why this block needs to be focussed, item of the enum: {@link FocusReason}
   */
  focus(reason: FocusReason) {
    if (this.meta.inputs === 0 || this.inputs.length === 0) return;

    if (
      reason === FocusReason.Duplicate ||
      reason === FocusReason.TurnInto ||
      reason === FocusReason.DeleteLast ||
      reason === FocusReason.ArrowPrevious
    ) {
      // focus at last character
      this.inputs[this.inputs.length - 1]?.focus();
    } else {
      // focus at first character
      this.inputs[0]?.focus(0);
    }
  }

  carry(data: InputData) {
    const length = getInputDataLength(data);
    const input = this.inputs[this.inputs.length - 1];
    if (!input) return false;
    input.carry(data);
    useLazy(() => input.focus(-length));
  }

  import(data: BlockData) {
    // TODO: Check if this.meta and data.meta are compatible
    if (this.inputs.length !== data.inputs.length) return false; // only reject if there are to little available?

    for (let i = 0; i < this.inputs.length; i++)
      this.inputs[i].import(data.inputs[i]);
  }

  export(reason: ExportReason): BlockData {
    return {
      meta: this.meta,
      inputs: this.inputs.map<ImportData>((e) => {
        return {
          index: e.index,
          content: e.export(reason),
        };
      }),
    };
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

function getInputDataLength(data: InputData): number {
  let res = 0;
  for (const i of data) res += i.type === 'text' ? i.content.length : 1;
  return res;
}
