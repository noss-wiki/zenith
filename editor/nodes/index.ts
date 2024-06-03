import type { Node } from '../lib/Node';
// Nodes
import Document from './Document';
import Text from './Text';
import Paragraph from './Paragraph';
import Header from './Header';
import SubHeader from './SubHeader';
import SubSubHeader from './SubSubHeader';
import TaskList from './TaskList';

export const nodes: readonly (typeof Node)[] = [
  Document,
  Text,
  Paragraph,
  Header,
  SubHeader,
  SubSubHeader,
  TaskList,
];

export function createNode<T extends string>(type: T) {
  const block = nodes.find((e) => e.type === type);
  if (!block) return null;
  return new block();
}
