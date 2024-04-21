import type { Editor } from '.';
import type { Block } from '../blocks';
import { Eventfull } from '../classes/eventfull';
import { Logger } from '../classes/logger';

export type ComponentType = 'handle' | 'actions';
export type ComponentClass<T extends ComponentType> = T extends 'actions'
  ? ActionsComponent
  : T extends 'handle'
  ? HandleComponent
  : Component;

export function createComponent<T extends ComponentType>(
  type: T,
  editor: Editor
): ComponentClass<T> {
  if (type === 'actions')
    return new ActionsComponent(type, editor) as ComponentClass<T>;
  else if (type === 'handle')
    return new HandleComponent(type, editor) as ComponentClass<T>;
  return new Component(type, editor) as ComponentClass<T>;
}

export class Component extends Eventfull {
  type: ComponentType;
  /**
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

export class ActionsComponent extends Component {
  type = 'actions' as const;
  show = ref<boolean>(false);
}

type Default<T> = T extends string ? T : 'text';

export class HandleComponent extends Component {
  logger = new Logger('handle');
  type = 'handle' as const;

  mount(ref: Ref<HTMLElement | undefined>) {
    if (super.mount(ref) === false) return;
    const handle = ref as Ref<HTMLElement>;

    this.on('element:mouseenter', (e) => {}, handle.value);
  }

  select() {
    if (!this.mounted) return;

    const block = this.editor.handle.active;
    if (!block) return;
    this.editor.handle.select();

    const c = this.editor.component('actions');
    if (c) c.show.value = true;
  }
  remove() {
    if (!this.mounted) return;

    const block = this.editor.handle.active;
    this.logger.info(block);
    if (block) this.editor.remove(block);
    this.editor.handle.active = undefined;
  }
  addBelow<T>(type?: T) {
    if (!this.mounted) return;

    const block = this.editor.handle.active;
    if (!block) return;
    const i = this.editor.blocks.indexOf(block) + 1;
    if (i === 0) return;

    const inserted = this.editor.add(
      i,
      typeof type === 'string' ? type : 'text'
    );
    setTimeout(() => inserted.interact.focus(), 0);
    return inserted as Block<Default<T>>;
  }
  addAbove<T>(type?: T) {
    if (!this.mounted) return;

    const block = this.editor.handle.active;
    if (!block) return;
    const i = this.editor.blocks.indexOf(block);
    if (i === -1) return;

    const inserted = this.editor.add(
      i,
      typeof type === 'string' ? type : 'text'
    );
    setTimeout(() => inserted.interact.focus(), 0);
    return inserted as Block<Default<T>>;
  }
}
