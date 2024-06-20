import type { NodeMetaData, NodeSchema, ElementDefinition } from '../lib/Node';
import { Node, Outlet } from '../lib/Node';
import icon from '@/assets/icons/blocks/paragraph.svg?raw';

export default class Text extends Node {
  static meta: NodeMetaData = {
    name: 'Text',
    description: '',
    icon,
  };

  static schema: NodeSchema = {
    group: 'inline',
  };

  static type = 'text';

  text: string;

  isInline = true;

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
}
