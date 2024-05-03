import type {
  BlockDescription,
  BlockInstance,
  BlockInstanceInteractable,
} from '.';
import type { Component } from 'vue';
import { instances } from '.';
import { createVNode, render } from 'vue';

import * as text from '@/components/editor/blocks/Text.vue';
import * as header from '@/components/editor/blocks/Header.vue';
import * as sub_header from '@/components/editor/blocks/SubHeader.vue';
import * as sub_sub_header from '@/components/editor/blocks/SubSubHeader.vue';
import * as task_list from '@/components/editor/blocks/TaskList.vue';

type BlockImport = {
  Instance: typeof BlockInstance;
  default: Component;
};

type BlockInfo = {
  meta: BlockDescription;
  component: Component;
};

export const blocks: BlockInfo[] = [
  info(text),
  info(header),
  info(sub_header),
  info(sub_sub_header),
  info(task_list),
];
export const defaultBlock = blocks[0];
export const meta = blocks.map((e) => e.meta);

function info(info: BlockImport): BlockInfo {
  return {
    meta: info.Instance.meta,
    component: info.default,
  };
}

export interface Block<Type extends string = string> {
  meta: Required<BlockDescription>;
  instance: BlockInstance;
  interact: BlockInstanceInteractable;
  root: HTMLElement;
  type: Type;

  unmount(): undefined;
}

export function createBlock<T extends string>(type: T): Block<T> {
  let block = blocks.find((e) => e.meta.type === type);
  if (!block) block = defaultBlock;

  let vnode = createVNode(block.component);
  const ele = document.createElement('div');

  render(vnode, ele);
  let instance = instances[instances.length - 1];
  let root = ele.children[0] as HTMLElement;
  instance.attach(root);

  block.meta.carry ??= 'both';
  block.meta.arrows ??= true;

  return {
    meta: block.meta as Required<BlockDescription>,
    type,
    root,
    instance: instance.instance,
    interact: instance,

    unmount() {
      render(null, ele);
      return;
    },
  };
}
