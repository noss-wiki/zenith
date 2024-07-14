import { Node } from '../lib/model/node';
import { NodeType } from '../lib/model/nodeType';

// TODO: move this to the node file
export default class Text extends Node {
  static type = NodeType.from({
    name: 'text',
    schema: {
      group: 'inline',
      inline: true,
    },
  });

  readonly text: string;

  constructor(content?: string) {
    super(undefined);
    if (!content) throw new Error('Empty text nodes are not allowed');
    this.text = content;
  }

  child(index: number): Node {
    throw new Error("Can't call the Node.child method on a text node");
  }

  insert(offset: number, content: string) {
    return this.replace(offset, offset, content);
  }

  cut(from: number, to?: number) {
    return this.copy(this.text.slice(from, to));
  }

  remove(from: number, to: number = this.text.length) {
    if (from < 0 || to > this.text.length)
      throw new Error("Positions are outside of the node's range");
    return this.copy(this.text.slice(0, from) + this.text.slice(to));
  }

  replace(from: number, to: number, slice: string) {
    return this.copy(this.text.slice(0, from) + slice + this.text.slice(to));
  }

  resolve(pos: number) {
    if (pos < 0 || pos > this.nodeSize)
      throw new Error(`Position: ${pos}, is outside the allowed range`);

    return undefined;
  }

  copy(content?: string): Node {
    return this.new(content, true);
  }
}
