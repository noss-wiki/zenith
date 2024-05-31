import type { NodeMetaData, NodeSchema, ElementDefinition } from './Node';
import { Node } from './Node';
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

  render(): ElementDefinition {
    return ['p', {}, 0];
  }
}
