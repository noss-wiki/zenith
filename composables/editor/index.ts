export class Editor {
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }
  /**
   * Removes all event listeners, to be used on the `onUnMount` hook to work with hmr
   */
  unmount() {}
}
