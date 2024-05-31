import type { ContentExpression } from '../lib/schema/expression';
import type { ResolvedBlockDescription } from '../blocks';
import { Eventfull } from '@/composables/classes/eventfull';

export class Node extends Eventfull {
  // TODO: Update description to include less
  static readonly meta: NodeMetaData;
  readonly meta: NodeMetaData;

  static readonly schema: NodeSchema;
  readonly schema: NodeSchema;

  id: string;
  type: string = '';
  root?: HTMLElement;
  outlets?: HTMLElement[];

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

  //isAtom
  /**
   * Wheter or not this node is a text node
   * @default false
   */
  isText = false;

  constructor() {
    super();
    const Class = <typeof Node>this.constructor;
    // TODO: error if not defined
    this.meta = Class.meta ?? {};
    this.schema = Class.schema ?? {};
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
  render(): ElementDefinition | null {
    return null;
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

  /**
   * Iterate over all childNodes, yields an array with first item the node, and second item the index.
   */
  *iter(): Generator<[Node, number], void, unknown> {
    for (let i = 0; i < this.content.length; i++) yield [this.content[i], i];
  }
}

/**
 * Meta data is data that is displayed (or used to display) info about this node in the ui.
 * Like the commands menu, or in the selection toolbar.
 */
export interface NodeMetaData {
  /**
   * The name that will be displayed to the user, e.g. in the commands menu
   */
  name: string;
  /**
   * The description that will be displayed to the user, e.g. in the commands menu
   */
  description: string;
  /**
   * Raw html code for icon, import using `*.svg?raw`
   */
  icon: string;
}

export interface NodeSchema {
  /**
   * The content expression for this node, when left empty it allows no content.
   */
  content?: string | ContentExpression;
  /**
   * The group or space seperated groups to which this Node belongs.
   */
  group?: string;
}

export type ElementDefinition = [
  keyof HTMLElementTagNameMap,
  {
    [x: string]: any;
  },
  ...(ElementDefinition | string | number)[]
];
