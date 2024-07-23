import { Node } from '../lib/model/node';
import { NodeType } from '../lib/model/nodeType';

export default class Document extends Node {
  static type = NodeType.from({
    name: 'document',
    schema: {
      content: 'block+',
      group: 'document',
    },
  });

  get nodeSize() {
    return this.content.size; // document start and end brackets don't count, as you can't focus outside of document
  }

  /* render(): ElementDefinition {
    return ['div', { contenteditable: 'true' }, Outlet];
  } */
}
