import type { EditorState } from '../state';

export interface ObserverEvent {
  readonly type: 'insertNode';
  readonly targetElement: HTMLElement | Text;
  readonly composing: boolean;
}

// Create `on` event functions to listen to events,
// Combine the mutationObserver and input events to simple events
// events: `insertNode`
export class DOMObserver {
  state: EditorState;
  cb: (e: any) => void;

  constructor(state: EditorState, callback: (e: any) => void) {
    this.state = state;
    this.cb = callback;
  }

  start() {}
  stop() {}
}
