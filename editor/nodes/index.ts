import type { Node } from '../lib/model/node';
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
  type: T,
  content?: string
): undefined | (T extends 'text' ? Text : Node) {
  if (type === 'text') return createTextNode(content!);

  const block = nodes.find((e) => e.type.name === type);
  if (!block) return;
  return new block() as T extends 'text' ? Text : Node;
}

export function createTextNode(content: string) {
  return new Text(content);
}
