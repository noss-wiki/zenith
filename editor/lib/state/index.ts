import { LoggerClass } from '@/composables/classes/logger';
import type { Node } from '../Node';
import { Transaction } from './transaction';

export class EditorState extends LoggerClass {
  readonly transactions: Transaction[] = [];

  constructor(readonly document: Node) {
    super();
  }

  /**
   * Create a new transaction in the editor
   * @param author Used to author changes, currently unused
   */
  tr(author?: string) {
    return new Transaction(this);
  }

  // Keep track of all transactions in the state, a transation should have the steps required to undo and (re)do a transaction,
  // all document changes should go via a transaction
  apply(tr: Transaction) {
    this.transactions.push(tr);
    tr.steps[0].apply(this.document);
  }

  // Node actions
  // - add, remove
}
