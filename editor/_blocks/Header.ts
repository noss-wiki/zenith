import type { NodeMetaData, NodeSchema, ElementDefinition } from './Node';
import { Node, Outlet } from './Node';
import icon from '@/assets/icons/blocks/header.svg?raw';

export default class Header extends Node {
  static meta: NodeMetaData = {
    name: 'Heading 1',
    description: 'The largest heading',
    icon,
  };

  static schema: NodeSchema = {
    content: 'inline*',
    group: 'block',
  };

  type = 'header';

  isBlock = true;

  render(): ElementDefinition {
    return ['h1', {}, Outlet];
  }
}
