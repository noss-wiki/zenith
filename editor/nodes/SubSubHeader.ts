import { Node } from '../lib/model/node';
import icon from '@/assets/icons/blocks/sub_sub_header.svg?raw';
import { NodeType } from '../lib/model/nodeType';

export default class SubSubHeader extends Node {
  static type = NodeType.extend('paragraph', {
    name: 'sub_sub_header',
    meta: {
      name: 'Heading 3',
      description: 'The smallest heading',
      icon,
    },
  });

  /* render(): ElementDefinition {
    return ['h3', {}, Outlet];
  } */
}
