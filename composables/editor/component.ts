import type { Editor } from '.';
import type { Block } from '../blocks';
import { Eventfull } from '../classes/eventfull';
import { Logger } from '../classes/logger';
import useLazy from '../useLazy';

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

export class ActionsComponent extends Component {
  type = 'actions' as const;
  show = ref<boolean>(false);
}

type Default<T> = T extends string ? T : 'text';

export class HandleComponent extends Component {
  logger = new Logger('handle');
  type = 'handle' as const;

  active: Block<string> | undefined;
  last: Block<string> | undefined;
  onHandle = false;

  mount(ref: Ref<HTMLElement | undefined>) {
    if (super.mount(ref) === false) return;
    const handle = ref as Ref<HTMLElement>;

    this.on(
      'element:mouseenter',
      (e) => {
        this.onHandle = true;
      },
      handle.value
    );
    this.on(
      'element:mouseleave',
      (e) => {
        this.onHandle = false;
      },
      handle.value
    );
  }

  // events

  move(item: number | string | Block<string>) {
    const block = this._getBlock(item);
    if (!block)
      return this.logger.error(
        `Block id: ${item}, could not be found in an existing editor instance.`,
        'Handle.move'
      );
    if (!block.instance._attached)
      return this.logger.error(
        `Block id: ${item}, has no attached dom element.`,
        `Handle.move`
      );

    this.last = this.active = block;
    this._moveHandle(block);
    this.ref.value.classList.remove('hidden');
  }

  hide(id: string) {
    const block = this._getBlock(id);
    if (this.active === undefined || this.active !== block) return;
    useLazy(() => {
      if (this.active !== block) return;
      else if (this.onHandle === false) {
        this.active = undefined;
        this.ref.value.classList.add('hidden');
      }
    });
  }

  // actions

  // TODO: doesn't work if selected previously and clicked of somehow
  select() {
    if (!this.mounted) return;

    const c = this.editor.component('actions');
    if (c) c.show.value = true;
  }
  remove() {
    if (!this.mounted) return;

    this.logger.info(this.last);
    if (this.last) this.editor.remove(this.last);
    this.last = undefined;

    const c = this.editor.component('actions');
    if (c) c.show.value = false;
  }
  addBelow<T>(type?: T) {
    if (!this.mounted) return;

    const block = this.last;
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

    const block = this.last;
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

  // helper

  _moveHandle(block: Block<string>) {
    if (!block.instance._attached) return;
    const editorRect = this.editor.editor.getBoundingClientRect();
    const blockRect = block.instance._attached.getBoundingClientRect();

    const top = blockRect.top - editorRect.top;
    this.ref.value.style.setProperty('--offset-top', `${top}px`);
  }

  _getBlock(item: number | string | Block<string>): Block<string> | undefined {
    let block: Block<string>;
    if (typeof item === 'number') block = this.editor.blocks[item];
    else if (typeof item === 'string') {
      const res = this.editor.blocks.find((e) => e.instance.id === item);
      if (!res) return undefined;
      block = res;
    } else block = item;
    return block;
  }
}