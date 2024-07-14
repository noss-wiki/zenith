import type { FragmentJSON } from './fragment';
import type { Slice } from './slice';
import { ContentExpression } from '../schema/expression';
import { Eventfull } from '@/composables/classes/eventfull';
import { NodeType } from './nodeType';
import { Fragment } from './fragment';
import { Position } from './position';

// TODO: Automatically register node that is extended from this class upon creation
/**
 * The base Node class
 */
export class Node extends Eventfull {
  static readonly type: NodeType;
  readonly type: NodeType;

  readonly id: string;

  /**
   * This node's children
   */
  readonly content: Fragment;
  /**
   * The text content if this node is a text node, or `null` otherwise.
   */
  text: string | null = null;
  /**
   * The string representation of the content
   */
  textContent: string = '';

  get nodeSize() {
    if (this.text !== null) return this.text.length; // the amount of characters
    else if (this.type.schema.inline === true)
      return 1; // non-text leaf nodes always have a length of 1
    else return this.content.size + 2; // the size of the content + 2 (the start and end tokens)
  }

  // also add marks later
  constructor(content?: Fragment) {
    super();
    this.type = (<typeof Node>this.constructor).type;
    this.id = Math.random().toString(36).slice(2);

    this.content = content || new Fragment([]);
  }

  /**
   * The result of the render hook; this is what will be displayed in the DOM.
   */
  render(): ElementDefinition | null {
    return null;
  }

  child(index: number): Node {
    return this.content.child(index);
  }

  insert(offset: number, content: string | Node) {
    if (typeof content === 'string')
      throw new Error('Cannot insert a string into a non-text node');
  }

  /**
   * Changes this nodes content to only include the content between the given positions.
   * This does not cut non-text nodes in half, meaning if the starting position is inside of a node, that entire node is included.
   */
  cut(from: number, to: number = this.content.size) {
    if (from === 0 && to === this.content.size) return this;
    this.content.cut(from, to);
    return this;
  }

  remove(from: number, to: number = this.content.size) {
    if (from < 0 || to > this.content.size)
      throw new Error("Positions are outside of the node's range");
    if (from === to) return this;

    this.content.remove(from, to);
    return this;
  }

  /**
   * Replaces the selection with the provided slice, if it fits.
   *
   * @param slice The slice to replace the selection with, or a string if this node is a text node.
   */
  replace(from: number, to: number, slice: Slice | string) {
    if (typeof slice === 'string')
      throw new Error('Cannot insert a string into a non-text node');

    if (slice.size === 0 && from === to) return this;
    else this.content.replace(from, to, slice, this);
    return this;
  }

  resolve(pos: number) {
    if (pos < 0 || pos > this.nodeSize)
      throw new Error(`Position: ${pos}, is outside the allowed range`);

    return Position.resolve(this, pos);
  }

  /**
   * Checks if `other` is equal to this node
   * @param other The node to check
   */
  eq(other: Node): boolean {
    if (this === other) return true;
    // TODO: also check if markup is the same
    return this.content.eq(other.content);
  }

  /**
   * Creates a deep copy of this node.
   * It does this by calling the copy method on the content fragment,
   * if this node has differnt behaviour it should override this function.
   */
  copy() {
    const content = this.content.copy();
    return this.new(content);
  }

  /**
   * Creates a new instance of this node type.
   * E.g when calling this on a Paragraph, it creates a new Paragraph node.
   */
  new(content?: Fragment) {
    const Class = <typeof Node>this.constructor;
    return new Class(content);
  }

  toJSON(): NodeJSON {
    return {
      id: this.id,
      type: this.type.name,
      content: this.content.toJSON(),
    };
  }
}

export type NodeJSON = {
  id: string;
  type: string;
  content: FragmentJSON;
};

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

export const Outlet = '<!-- Outlet -->';

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
