import type { Editor } from '.';

export type ComponentType = 'handle' | 'actions';
export type ComponentClass<T extends ComponentType> = T extends 'actions'
  ? ActionsComponent
  : Component;

export class Component {
  type: ComponentType;
  /**
   * `ref.value` will always be defined if `mounted` is true, otherwise it might be undefined, even if type says it isn't
   */
  ref: Ref<HTMLElement> = ref<HTMLElement>() as Ref<HTMLElement>;
  mounted = false;

  #editor: Editor;

  constructor(type: ComponentType, editor: Editor) {
    this.type = type;
    this.#editor = editor;
  }

  mount(ref: Ref<HTMLElement | undefined>) {
    if (ref.value === undefined) return;
    this.ref = ref as Ref<HTMLElement>;
    this.mounted = true;
  }
}

export class ActionsComponent extends Component {
  type: ComponentType = 'actions';
  show = ref<boolean>(false);
}
