import type { Node } from '../model/node';
import type { EditorState } from '../state';
import { DOMObserver } from './observer';

export class EditorView {
  root: HTMLElement = document.createElement('div');
  /**
   * The state of the document
   */
  state: EditorState;
  /**
   * The currently rendered state, this may differ from `state`, to update call `update`
   */
  renderedState: EditorState | null = null;

  domObserver: DOMObserver;

  mounted = false;

  constructor(state: EditorState) {
    this.state = state;
    this.domObserver = new DOMObserver(this.state, (e) => this.mutation(e));
  }

  mount(root: HTMLElement) {
    if (!(root instanceof Element))
      throw new Error('Invalid type for paramater root, in EditorView.mount');
    this.root = root;
    this.mounted = true;

    //this.root.appendChild(this.state.document.root);
    return this;
  }

  unmount() {}

  /**
   * Renders the DOM view to represent the state, this function rerenders everything,
   * use `update` to only rerender changed nodes
   * @param forceNodeRoots If true, force nodes to rerender their root
   */
  render(forceNodeRoots?: boolean) {}

  /**
   * Updates the DOM to represent the current state
   */
  update() {
    if (!this.renderedState) return this.render();
    const prev = this.renderedState;
    this.renderedState = this.state;
  }

  private mutation(e: MutationRecord[]) {
    console.log(e);
  }
}
