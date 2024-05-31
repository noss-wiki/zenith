import type { NodeMetaData, NodeSchema, ElementDefinition } from './Node';
import { Node, Outlet } from './Node';
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

  type = 'paragraph';

  isBlock = true;

  render(): ElementDefinition {
    return ['p', {}, Outlet];
  }
}
