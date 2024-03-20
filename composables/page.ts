import type { Block, AbstractBlock } from './block';
import { TextBlock } from './blocks/text';

export interface PageData {
  title: string;
  // icon: string; // probably make type for this
  // cover: string; // cover image
  content: AbstractBlock[];
  // comments: Comment[];
  // users: PageUsers[]; // include info like permissions, last edited/viewed, and reference to a global `User` type?
}
