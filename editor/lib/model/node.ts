import type { FragmentJSON } from './fragment';
import type { Slice } from './slice';
import { NodeType } from './nodeType';
import { Fragment } from './fragment';
import { Position } from './position';
import { MethodError, NotImplementedError } from '../error';

// TODO: Automatically register node that is extended from this class upon creation
// so the node type can be created automatically
/**
 * The base Node class
 */
export class Node {
  static readonly type: NodeType;
  readonly type: NodeType;

  readonly id: string;

  /**
   * This node's children
   */
  readonly content: Fragment;
  /**
   * The text content if this node is a text node, or `null` otherwise.
   * This is used to determine if a node is a text node or not.
   */
  readonly text: string | null = null;
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

  get childCount() {
    return this.content.childCount;
  }

  // also add marks later
  constructor(content?: Fragment | string) {
    this.type = (<typeof Node>this.constructor).type;

    if (typeof content === 'string')
      throw new MethodError(
        `The node type ${this.type.name}, needs to override the constructor method to support inserting text content, as the default implementation does not support it`,
        'Node.constructor'
      );

    // Link this node class to the provided nodeType
    if (
      this.type.node !== undefined &&
      this.type.node !== <typeof Node>this.constructor
    )
      throw new MethodError(
        `A different node definition for the type ${this.type.name}, already exists`,
        'Node.constructor'
      );

    this.type.node = <typeof Node>this.constructor;

    this.id = Math.random().toString(36).slice(2);

    this.content = content || new Fragment([]);
  }

  child(index: number): Node {
    return this.content.child(index);
  }

  /**
   * Inserts the content at the given offset.
   *
   * @returns The modified node
   * @throws {MethodError} If the node type doesn't support text content and the content argument is of type string.
   */
  insert(offset: number, content: string | Node | Node[] | Fragment) {
    if (typeof content === 'string')
      throw new MethodError(
        `The node type ${this.type.name}, needs to override the insert method to support inserting text content, as the default implementation does not support it`,
        'Node.insert'
      );

    const { index, offset: o } = Position.offsetToIndex(this, offset, true);
    if (o === 0) return this.copy(this.content.insert(content, index));
    throw new NotImplementedError('Node.insert', true);
  }

  /**
   * Changes this nodes content to only include the content between the given positions.
   * This does not cut non-text nodes in half, meaning if the starting position is inside of a node, that entire node is included.
   */
  cut(from: number, to: number = this.content.size) {
    if (from === 0 && to === this.content.size) return this;
    return this.copy(this.content.cut(from, to));
  }

  /**
   * Removes the content between the given positions.
   *
   * @returns The modified node
   * @throws {MethodError} If one or more of the positions are outside of the allowed range.
   */
  remove(from: number, to: number = this.content.size) {
    if (from < 0 || to > this.content.size)
      throw new MethodError(
        `One or more of the positions ${from} and ${to} are outside of the allowed range`,
        'Node.remove'
      );
    if (from === to) return this;

    return this.copy(this.content.remove(from, to));
  }

  /**
   * Replaces the selection with the provided slice, if it fits.
   *
   * @param slice The slice to replace the selection with, or a string if this node is a text node.
   * @throws {MethodError} If the node type doesn't support text content and the slice argument is of type string.
   */
  replace(from: number, to: number, slice: Slice | string) {
    if (typeof slice === 'string')
      throw new MethodError(
        `The node type ${this.type.name}, needs to override the replace method to support inserting text content, as the default implementation does not support it`,
        'Node.replace'
      );

    if (slice.size === 0 && from === to) return this;
    else return this.copy(this.content.replace(from, to, slice, this));
  }

  private resolveCache: { [pos: number]: Position } = {};

  /**
   * Resolves a position inside this nodes, using `Position.resolve`.
   * The result is cached, so calling this method multiple times with the same position will return the cached position.
   *
   * @param pos The absolute position inside this node to resolve
   * @returns The resolved position if successful, or `undefined` if resolving failed.
   * @throws {MethodError} If the position is outside of the allowed range or it could not be resolved by `Position.resolve`.
   */
  resolve(pos: number) {
    if (pos < 0 || pos > this.nodeSize)
      throw new MethodError(
        `The position ${pos}, is outside of the allowed range`,
        'Node.resolve'
      );

    if (this.resolveCache[pos] !== undefined) return this.resolveCache[pos];

    const res = Position.resolve(this, pos);
    if (!res)
      throw new MethodError(
        `The position ${pos}, could not be resolved`,
        'Node.resolve'
      );
    return (this.resolveCache[pos] = res);
  }

  /**
   * Resolves a position inside this nodes, using `Position.resolve`.
   * Unlike `Node.resolve`, this method does not cache the result,
   * so calling this multiple times with the same position is more expensive.
   *
   * @param pos The absolute position inside this node to resolve
   * @returns The resolved position if successful, or `undefined` if resolving failed.
   * @throws {MethodError} If the position is outside of the allowed range
   */
  resolveNoCache(pos: number) {
    if (pos < 0 || pos > this.nodeSize)
      throw new MethodError(
        `The position ${pos}, is outside of the allowed range`,
        'Node.resolveNoCache'
      );

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
  copy(content?: Fragment | string) {
    if (content === this.content) return this;
    return this.new(content, true);
  }

  /**
   * Creates a new instance of this node type.
   * E.g when calling this on a Paragraph, it creates a new Paragraph node.
   * @throws {MethodError} If the node type doesn't support text content and the content argument is of type string.
   */
  new(content?: Fragment | string, keepId?: boolean) {
    if (typeof content === 'string' && this.text === null)
      throw new MethodError(
        `The node type ${this.type.name}, doesn't support text content`,
        'Node.new'
      );

    const Class = <typeof Node>this.constructor;
    // TODO: Also include other things, like marks, etc.
    // @ts-ignore
    const inst = new Class(content);
    // @ts-ignore
    if (keepId) inst.id = this.id;
    return inst;
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
