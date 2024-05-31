import type { NodeMetaData, NodeSchema, ElementDefinition } from './Node';
import { Node, Outlet } from './Node';
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

  type = 'text';

  isInline = true;

  render(): ElementDefinition {
    return ['p', {}, Outlet];
  }
}
