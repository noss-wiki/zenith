import type { BlockDescription, Category } from '@/editor/blocks';
import { categories, meta } from '@/editor/blocks';

export type SortedBlocks = {
  [x in Category]: BlockDescription[];
};

const sorted = getSorted();

export function useBlocks(): {
  blocks: BlockDescription[];
  sorted: SortedBlocks;
  categories: Category[];
} {
  return { blocks: meta, sorted, categories };
}

function getSorted() {
  let res: { [x in any]: any } = {};
  for (const i of categories) res[i] = meta.filter((e) => e.category == i);

  return res as SortedBlocks;
}
