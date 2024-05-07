import type { Editor } from '..';
import { Eventfull } from '../../classes/eventfull';

export type ComponentType = 'handle' | 'actions' | 'selection';

export class Component extends Eventfull {
  type: ComponentType;
  /**
   * This should be an element ref to the root of the component template
   * `ref.value` will always be defined if `mounted` is true, otherwise it might be undefined, even if type says it isn't
   */
  ref: Ref<HTMLElement> = ref<HTMLElement>() as Ref<HTMLElement>;
  mounted = false;
  editor: Editor;

  constructor(type: ComponentType, editor: Editor) {
    super();
    this.type = type;
    this.editor = editor;
  }

  mount(ref: Ref<HTMLElement | undefined>): boolean | void {
    if (ref.value === undefined) return false;
    this.ref = ref as Ref<HTMLElement>;
    return (this.mounted = true);
  }

  unmount() {
    super.unmount();
    this.mounted = false;
  }
}
