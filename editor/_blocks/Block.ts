import { Eventfull } from '@/composables/classes/eventfull';
import type { ResolvedBlockDescription } from '../blocks';

export class Block extends Eventfull {
  static readonly meta: ResolvedBlockDescription;
  readonly meta: ResolvedBlockDescription;

  id: string;
  type: string;
  root?: HTMLElement;

  constructor() {
    super();
    this.meta = (<typeof Block>this.constructor).meta;
    this.type = this.meta.type;

    this.id = Math.random().toString(36).slice(2);
  }

  /**
   * The result of the render hook, is what will be displayed in the DOM.
   * This hook should return the same element as `this.root`.
   */
  render(): HTMLElement {
    return document.createElement('div');
  }

  /**
   * Creates the root for this block, the result of the function is also assigned to `this.root` automatically.
   * This root should be returned from the render hook.
   */
  attachRoot(): HTMLElement {
    const ele = document.createElement('div');
    ele.className = `noss-selectable noss-${this.type}-block`;
    ele.setAttribute('data-block-id', this.id);

    this.root = ele;
    return ele;
  }
}
