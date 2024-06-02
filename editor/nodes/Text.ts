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

  isInline = true;

  render(): ElementDefinition {
    return ['p', {}, Outlet];
  }
}
