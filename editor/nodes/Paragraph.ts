import { Node } from '../lib/model/node';
import icon from '@/assets/icons/blocks/paragraph.svg?raw';
import { NodeType } from '../lib/model/nodeType';

export default class Paragraph extends Node {
  static type = NodeType.from({
    name: 'paragraph',
    meta: {
      name: 'Paragraph',
      description: 'Simple plain text',
      icon,
    },
    schema: {
      content: 'inline*',
      group: 'block',
    },
  });

  /* render(): ElementDefinition {
    return ['p', {}, Outlet];
  } */
}
