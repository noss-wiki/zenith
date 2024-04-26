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

type BlockImport = {
  Instance: typeof BlockInstance;
  default: Component;
};

type BlockInfo = {
  meta: BlockDescription;
  component: Component;
};

export const meta = [text.Instance.meta, header.Instance.meta];
export const defaultBlock = info(text);
export const blocks: BlockInfo[] = [defaultBlock, info(header)];

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
