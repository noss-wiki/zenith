import type { NodeMetaData, NodeSchema, ElementDefinition } from '../lib/Node';
import { Node, Outlet } from '../lib/Node';

export default class Document extends Node {
  static meta: NodeMetaData = {
    name: 'Document',
    description: 'The document base node',
    icon: '',
    visible: false,
  };

  static schema: NodeSchema = {
    content: 'block+',
    group: 'document',
  };

  static type = 'document';

  isBlock = true;

  render(): ElementDefinition {
    return ['div', {}, Outlet];
  }
}
