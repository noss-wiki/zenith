import type { NodeMetaData, NodeSchema, ElementDefinition } from '../lib/Node';
import { Node, Outlet } from '../lib/Node';
import icon from '@/assets/icons/blocks/sub_header.svg?raw';

export default class SubHeader extends Node {
  static meta: NodeMetaData = {
    name: 'Heading 2',
    description: 'Medium heading',
    icon,
  };

  static schema: NodeSchema = {
    content: 'inline*',
    group: 'block',
  };

  static type = 'sub_header';

  isBlock = true;

  render(): ElementDefinition {
    return ['h2', {}, Outlet];
  }
}
