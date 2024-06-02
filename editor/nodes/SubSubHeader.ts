import type { NodeMetaData, NodeSchema, ElementDefinition } from '../lib/Node';
import { Node, Outlet } from '../lib/Node';
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

  static type = 'sub_sub_header';

  isBlock = true;

  render(): ElementDefinition {
    return ['h3', {}, Outlet];
  }
}
