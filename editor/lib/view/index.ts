import type { EditorState } from '../state';

export class EditorView {
  root: HTMLElement = null as unknown as HTMLElement;
  state: EditorState;

  mounted = false;

  constructor(state: EditorState) {
    this.state = state;
  }

  mount(root: HTMLElement) {
    if (!(root instanceof Element))
      throw new Error('Invalid type for paramater root, in EditorView.mount');
    this.root = root;
    this.root.setAttribute('contentEditable', 'true');
    this.mounted = true;
  }

  unmount() {}
}
