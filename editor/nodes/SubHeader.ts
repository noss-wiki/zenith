import type { ElementDefinition } from '../lib/model/node';
import { Node, Outlet } from '../lib/model/node';
import icon from '@/assets/icons/blocks/sub_header.svg?raw';
import { NodeType } from '../lib/model/nodeType';

export default class SubHeader extends Node {
  static type = NodeType.extend('paragraph', {
    name: 'sub_header',
    meta: {
      name: 'Heading 2',
      description: 'Medium heading',
      icon,
    },
  });

  render(): ElementDefinition {
    return ['h2', {}, Outlet];
  }
}
