import { Eventfull } from '@/composables/classes/eventfull';
import type { ResolvedBlockDescription } from '../blocks';

export class Node extends Eventfull {
  // TODO: Update description to include less
  static readonly meta: ResolvedBlockDescription;
  readonly meta: ResolvedBlockDescription;

  id: string;
  type: string;
  root?: HTMLElement;

  /**
   * This node's children
   */
  content: Node[] = [];
  /**
   * The text content if this node is a text node, or `null` otherwise.
   */
  text: string | null = null;
  /**
   * The string representation of the content
   */
  textContent: string = '';

  // state props
  /**
   * Whether this Node is a block.
   * This is the opposite of `isInline`
   * @default true
   */
  isBlock: boolean = null as unknown as boolean;
  /**
   * Whether this Node is an inline node.
   * This is the opposite of `isBlock`
   * @default false
   */
  isInline: boolean = null as unknown as boolean;
  /**
   * Wheter or not this node is a leaf, which means it can't hold any text content
   * @default false
   */
  isLeaf = false;
  /**
   * Wheter or not this node is a text node
   * @default false
   */
  isText = false;

  constructor() {
    super();
    this.meta = (<typeof Node>this.constructor).meta;
    this.type = this.meta.type;
    this.id = Math.random().toString(36).slice(2);

    if (this.isBlock === true && this.isInline === null) this.isInline = false;
    else if (this.isInline === true && this.isBlock === null)
      this.isBlock = false;
    if (this.isBlock === null) this.isBlock = true;
    if (this.isInline === null) this.isInline = false;
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

  *iter(): Generator<[Node, number], void, unknown> {
    for (let i = 0; i < this.content.length; i++) yield [this.content[i], i];
  }
}
