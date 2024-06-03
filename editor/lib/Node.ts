import { ContentExpression } from './schema/expression';
import { Eventfull } from '@/composables/classes/eventfull';

/**
 * The base Node class
 */
export class Node extends Eventfull {
  // TODO: Update description to include less
  static readonly meta: NodeMetaData;
  readonly meta: NodeMetaData;

  static readonly schema: NodeSchema;
  readonly schema: NodeSchema;

  static readonly type: string = '';
  readonly type: string;

  id: string;
  root: HTMLElement;
  outlet?: HTMLElement;
  parent?: Node;

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
    this.type = Class.type ?? '';
    this.meta = Class.meta ?? {};
    this.schema = Class.schema ?? {};
    this.id = Math.random().toString(36).slice(2);

    if (this.isBlock === true && this.isInline === null) this.isInline = false;
    else if (this.isInline === true && this.isBlock === null)
      this.isBlock = false;
    if (this.isBlock === null) this.isBlock = true;
    if (this.isInline === null) this.isInline = false;

    // render
    const root = this._renderRoot();
    if (!root)
      throw new Error(`Render hook is not specified on node: ${this.type}`);

    this.root = root;
  }

  _renderRoot() {
    const res = this.render();
    if (res === null) return null;

    const renderPart = (part: ElementDefinition) => {
      const ele = document.createElement(part[0]) as HTMLElement;

      // Attributes
      for (const attr in part[1]) {
        //@ts-ignore
        const val = part[1][attr];
        if (val === 'children') continue;
        else if (attr.startsWith('on') && typeof val === 'function') {
          // bind event listener
          const event = attr
            .slice(2)
            .toLowerCase() as keyof HTMLElementEventMap;
          this.on(`element:${event}`, (e) => val(e), ele);
        } else if (attr === 'style') style(ele, val);
        else ele.setAttribute(attr, val);
      }

      // Children
      const children = part.slice(2) as ChildDefinition[];
      for (const child of children) {
        if (typeof child === 'string') {
          if (child !== Outlet) ele.appendChild(document.createTextNode(child));
          else if (this.outlet !== ele) {
            this.outlet = ele;
            ele.setAttribute('data-outlet', 'true');
          }
        } else if (
          typeof child === 'number' ||
          child === true ||
          child instanceof Date ||
          child instanceof RegExp
        )
          ele.appendChild(document.createTextNode(child.toString()));
        else if (Array.isArray(child)) ele.appendChild(renderPart(child));
      }

      return ele;
    };

    const root = renderPart(res);
    root.setAttribute('data-node', 'true');
    if (this.isBlock) root.setAttribute('data-block', 'true');
    else if (this.isInline) root.setAttribute('data-inline', 'true');

    // verify outlet

    return root;
  }

  /**
   * The result of the render hook, is what will be displayed in the DOM.
   * This hook should return the same element as `this.root`.
   */
  render(): ElementDefinition | null {
    return null;
  }

  /**
   * Check wheter the content of this node conforms to the schema
   */
  check() {
    const expression =
      this.schema.content instanceof ContentExpression
        ? this.schema.content
        : new ContentExpression(this.schema.content);
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
  /**
   * If this Node is visible for selection in the UI
   * @default true
   */
  visible?: boolean;
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
  ...ChildDefinition[]
];

type ChildDefinition = ElementDefinition | string | number | boolean;

export const Outlet = '<!-- _Outlet -->';

// https://github.com/CodeFoxDev/honeyjs-core/blob/main/src/jsx-runtime.js#L83
function style(element: HTMLElement, style: { [x: string]: string }) {
  let res = {};
  for (const property in style) {
    let cssProp = property
      .replace(/[A-Z][a-z]*/g, (str) => '-' + str.toLowerCase() + '-')
      .replace('--', '-') // remove double hyphens
      .replace(/(^-)|(-$)/g, ''); // remove hyphens at the beginning and the end
    if (
      typeof style[property] === 'string' ||
      typeof style[property] === 'number'
    ) {
      //@ts-ignore
      element.style[cssProp] = style[property];
    } else console.warn('Unknown style value:', style[property]);
  }
  return res;
}
