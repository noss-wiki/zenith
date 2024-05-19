import type { Block } from '../blocks';
import { Component } from './component';
import { Logger } from '@/composables/classes/logger';
import { ExportReason, FocusReason } from '../blocks/hooks';

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

  hide(id: string | number | Block<string>) {
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

  select() {
    if (!this.mounted) return;

    const c = this.editor.component('actions');
    if (c) c.show.value = true;
  }
  remove() {
    if (!this.mounted) return;

    if (this.last) this.editor.remove(this.last);
    this.last = undefined;
  }
  addBelow<T>(type?: T, focus: boolean = true) {
    if (!this.mounted || !this.last) return;
    const i = this.editor.blocks.indexOf(this.last) + 1;
    if (i === 0) return;

    const inserted = this.editor.add(
      i,
      typeof type === 'string' ? type : 'text'
    );
    if (focus) setTimeout(() => inserted.interact.focus(), 0);
    return inserted as Block<Default<T>>;
  }
  addAbove<T>(type?: T) {
    if (!this.mounted || !this.last) return;
    const i = this.editor.blocks.indexOf(this.last);
    if (i === -1) return;

    const inserted = this.editor.add(
      i,
      typeof type === 'string' ? type : 'text'
    );
    setTimeout(() => inserted.interact.focus(), 0);
    return inserted as Block<Default<T>>;
  }
  duplicate() {
    if (!this.mounted || !this.last) return false;
    const inserted = this.addBelow(this.last.type, false);
    if (!inserted) return false;

    const data = this.last.instance.export(ExportReason.Duplicate);
    inserted.instance.import(data);
    useLazy(() => inserted.instance.focus(FocusReason.Duplicate));
  }
  turnInto(type: string = 'text') {
    if (!this.mounted || !this.last) return false;
    const inserted = this.addBelow(type, false);
    if (!inserted) return false;

    const data = this.last.instance.export(ExportReason.TurnInto);
    inserted.instance.import(data);
    this.editor.remove(this.last);

    this.hide(this.last);
    this.last = inserted;
    this._moveHandle(inserted);
    useLazy(() => inserted.instance.focus(FocusReason.TurnInto));
  }

  // helper

  _moveHandle(block: Block<string>) {
    if (!block.instance._attached) return;
    const editorRect = this.editor.editor.getBoundingClientRect();
    const blockRect = block.instance._attached.getBoundingClientRect();
    const height =
      this.last?.meta.centerHandle === true ? blockRect.height / 2 - 12 : 0;

    const top = blockRect.top - editorRect.top + height;
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
