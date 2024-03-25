import { SimpleBlock } from '../block';
import {
  options,
  default as TextBlockComp,
} from '@/components/editor/blocks/Text.vue';

export class TextBlock extends SimpleBlock {
  name = 'Text';
  format = 'text';
  description = 'Simple plain text';
}
