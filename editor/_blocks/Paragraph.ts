import { description, BlockInstance } from '../blocks/instance';
import { Node } from './Node';

export default class Paragraph extends Node {
  static readonly meta = description({
    name: 'Paragraph',
    description: 'Simple plain text',
    type: 'paragraph',
    category: 'simple_text',
    inputs: 1,
    icon: '',
  } as const);

  isBlock = true;

  render(): HTMLElement {
    const root = this.attachRoot();
    // add an input to the root
    return root;
  }
}
