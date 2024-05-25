import { description, BlockInstance } from '../blocks/instance';
import { Block } from './Block';

export default class Text extends Block {
  static readonly meta = description({
    name: 'Text',
    description: 'Simple plain text',
    type: 'text',
    category: 'simple_text',
    inputs: 1,
    icon: '',
  } as const);

  render(): HTMLElement {
    const root = this.attachRoot();
    // add an input to the root
    return root;
  }
}
