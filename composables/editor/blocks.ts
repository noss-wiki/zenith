import type { BlockDescription, BlockInstanceInteractable } from '../block';
import type { Component } from 'vue';
import { instances } from '../block';
import { createVNode, render } from 'vue';

import {
  meta as textMeta,
  default as TextVue,
} from '@/components/editor/blocks/Text.vue';
import {
  meta as headingMeta,
  default as HeadingVue,
} from '@/components/editor/blocks/Header.vue';

const defaultBlock = {
  meta: textMeta,
  vue: TextVue,
};

const blocks: {
  meta: BlockDescription;
  vue: Component;
}[] = [
  defaultBlock,
  {
    meta: headingMeta,
    vue: HeadingVue,
  },
] as const;

export interface Block<Type extends string = string> {
  instance: BlockInstanceInteractable;
  root: HTMLElement;
  type: Type;

  unmount(): undefined;
}

export function createBlock<T extends string>(type: T): Block<T> {
  let block = blocks.find((e) => e.meta.type === type);
  if (!block) block = defaultBlock;

  let vnode = createVNode(block.vue);
  const ele = document.createElement('div');

  render(vnode, ele);
  let instance = instances[instances.length - 1];
  let root = ele.children[0] as HTMLElement;
  instance.attach(root);

  return {
    type,
    root,
    instance,

    unmount() {
      render(null, ele);
      return;
    },
  };
}
