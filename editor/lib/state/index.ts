import { LoggerClass } from '@/composables/classes/logger';
import type { Node } from '../Node';
import { Transaction } from './transaction';

export class EditorState extends LoggerClass {
  document: Node;

  constructor(document: Node) {
    super();
    this.document = document;
  }

  /**
   * Create a new transaction in the editor
   * @param author Used to author changes, currently unused
   */
  tr(author?: string) {
    return new Transaction(this);
  }

  // Node actions
  // - add, remove
}
