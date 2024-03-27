import type { BlockDescription } from '../block';
import type { Component } from 'vue';

import {
  options as textOptions,
  default as TextVue,
} from '@/components/editor/blocks/Text.vue';
import {
  options as headingOptions,
  default as HeadingVue,
} from '@/components/editor/blocks/Header.vue';

const blocks: {
  meta: BlockDescription;
  vue: Component;
}[] = [
  {
    meta: textOptions,
    vue: TextVue,
  },
  {
    meta: headingOptions,
    vue: HeadingVue,
  },
] as const;
