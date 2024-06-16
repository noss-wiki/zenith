import type { Node } from '../lib/Node';
// Nodes
import Document from './Document';
import Text from './Text';
import Paragraph from './Paragraph';
import Header from './Header';
import SubHeader from './SubHeader';
import SubSubHeader from './SubSubHeader';
import TaskList from './TaskList';

export const nodes: readonly (typeof Node | typeof Text)[] = [
  Document,
  Text,
  Paragraph,
  Header,
  SubHeader,
  SubSubHeader,
  TaskList,
];

export function createNode<T extends string>(
  type: T
): null | (T extends 'text' ? Text : Node) {
  const block = nodes.find((e) => e.type === type);
  if (!block) return null;
  return new block() as T extends 'text' ? Text : Node;
}

export function createTextNode(content: string) {
  return new Text(content);
}
