import type { BlockDescription, Category } from './block';
import { categories } from './block';
import { meta as textMeta } from '@/components/editor/blocks/Text.vue';
import { meta as headingMeta } from '@/components/editor/blocks/Header.vue';

export type SortedBlocks = {
  [x in Category]: BlockDescription[];
};

const blocks = [textMeta, headingMeta];
const sorted = getSorted();

export function useBlocks(): {
  blocks: BlockDescription[];
  sorted: SortedBlocks;
  categories: Category[];
} {
  return { blocks, sorted, categories };
}

function getSorted() {
  let res: { [x in any]: any } = {};
  for (const i of categories) res[i] = blocks.filter((e) => e.category == i);

  return res as SortedBlocks;
}
