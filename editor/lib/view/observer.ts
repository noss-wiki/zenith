import { EventEmitter } from '@/composables/classes/EventEmitter';
import type { EditorState } from '../state';

export type ObserverEventType = 'insertNode';

export interface ObserverEventMap {
  insertNode: ObserverEvent<'insertNode'>;
}

export interface ObserverEvent<T = ObserverEventType> {
  readonly type: T;
  readonly targetElement: HTMLElement | Text;
  readonly composing: boolean;
}

// Create `on` event functions to listen to events,
// Combine the mutationObserver and input events to simple events
// events: `insertNode`
export class DOMObserver extends EventEmitter<ObserverEventMap> {
  state: EditorState;
  cb: (e: any) => void;

  constructor(state: EditorState, callback: (e: any) => void) {
    super(false);
    this.state = state;
    this.cb = callback;

    /* new MutationObserver((e) => {
      console.log(e);
    }).observe(this.state.document.root, {
      childList: true,
      attributes: true,
      subtree: true,
    }); */
  }

  start() {}
  stop() {}
}
