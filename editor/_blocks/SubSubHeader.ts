import type { NodeMetaData, NodeSchema, ElementDefinition } from './Node';
import { Node, Outlet } from './Node';
import icon from '@/assets/icons/blocks/sub_sub_header.svg?raw';

export default class SubSubHeader extends Node {
  static meta: NodeMetaData = {
    name: 'Heading 3',
    description: 'The smallest heading',
    icon,
  };

  static schema: NodeSchema = {
    content: 'inline*',
    group: 'block',
  };

  type = 'sub_sub_header';

  isBlock = true;

  render(): ElementDefinition {
    return ['h3', {}, Outlet];
  }
}
