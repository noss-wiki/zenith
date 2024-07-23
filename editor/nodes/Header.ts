import { Node } from '../lib/model/node';
import icon from '@/assets/icons/blocks/header.svg?raw';
import { NodeType } from '../lib/model/nodeType';

export default class Header extends Node {
  static type = NodeType.extend('paragraph', {
    name: 'header',
    meta: {
      name: 'Heading 1',
      description: 'The largest heading',
      icon,
    },
  });

  /* render(): ElementDefinition {
    return ['h1', {}, Outlet];
  } */
}
