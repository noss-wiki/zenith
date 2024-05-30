import type { NodeMetaData, NodeSchema } from './Node';
import { Node } from './Node';
import { description, BlockInstance } from '../blocks/instance';
import icon from '@/assets/icons/blocks/paragraph.svg?raw';

export default class Paragraph extends Node {
  static meta: NodeMetaData = {
    name: 'Paragraph',
    description: 'Simple plain text',
    icon,
  };

  static schema: NodeSchema = {
    content: 'inline*',
    group: 'block',
  };

  isBlock = true;

  render(): HTMLElement {
    const root = this.attachRoot();
    // add an input to the root
    return root;
  }
}
