import type { ElementDefinition } from '../lib/model/node';
import { Node, Outlet } from '../lib/model/node';
import icon from '@/assets/icons/blocks/paragraph.svg?raw';
import { NodeType } from '../lib/model/nodeType';

export default class Text extends Node {
  static type = NodeType.from({
    name: 'text',
    meta: {
      name: 'Text',
      description: '',
      icon,
    },
    schema: {
      group: 'inline',
      inline: true,
    },
  });

  text: string;

  constructor(content?: string) {
    super(undefined);
    if (!content) throw new Error('Empty text nodes are not allowed');
    this.text = content;
  }

  // this needs to change, as it doesn't support dom's `Text` and it needs to rerender everytime content is changed
  // maybe via a setter?
  render(): ElementDefinition {
    return ['p', {}, Outlet];
  }

  cut(from: number, to?: number) {
    this.text = this.text.slice(from, to);
  }

  copy(): Node {
    // @ts-ignore
    return this.new(this.text);
  }
}
