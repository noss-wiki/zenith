import type { BlockDescription } from './block';
import { meta as textMeta } from '@/components/editor/blocks/Text.vue';
import { meta as headingMeta } from '@/components/editor/blocks/Header.vue';

const blocks = [textMeta, headingMeta];

export function useBlocks(): { blocks: BlockDescription[] } {
  return { blocks };
}
