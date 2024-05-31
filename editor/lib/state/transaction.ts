import type { EditorState } from '.';

export class Transaction {
  #state: EditorState;

  constructor(state: EditorState) {
    this.#state = state;
  }
}
