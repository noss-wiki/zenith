import type {
  NodeMetaData,
  NodeSchema,
  ElementDefinition,
} from '../lib/model/node';
import { Node, Outlet } from '../lib/model/node';

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

  get nodeSize() {
    return this.content.size; // document start and end brackets don't count, as you can't focus outside of document
  }

  render(): ElementDefinition {
    return ['div', { contenteditable: 'true' }, Outlet];
  }
}
