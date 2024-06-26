import type {
  InputNode,
  InputNodeElement,
  InputNodeSelection,
  FormatType,
} from '../blocks/data';
import { formatTypes } from '../blocks/data';
import { createTextNode } from './nodes';

export function getContent<T extends boolean>(
  root: HTMLElement,
  nodes?: T
): T extends true ? InputNodeElement[] : InputNode[] {
  if (!root) return [];
  const res: (InputNode & { node?: Node })[] = [];
  nodes ??= false as T;

  for (const node of clean(root.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE)
      if (nodes)
        res.push({
          type: 'text',
          style: [],
          content: node.textContent ?? '',
          node,
        });
      else
        res.push({
          type: 'text',
          style: [],
          content: node.textContent ?? '',
        });
    else if (node.nodeType === Node.ELEMENT_NODE) {
      const ele = node as Element;
      if (ele.tagName === 'BR') continue;
      if (ele.tagName === 'SPAN' && ele.classList.contains('noss-text-node')) {
        const style: FormatType[] = [];
        for (const [_key, value] of ele.classList.entries())
          if (formatTypes.includes(value as FormatType))
            style.push(value as FormatType);

        if (nodes)
          res.push({
            type: 'text',
            style,
            content: ele.textContent ?? '',
            node,
          });
        else
          res.push({
            type: 'text',
            style,
            content: ele.textContent ?? '',
          });
      }
    }
  }

  if (res.length === 0) {
    const data = createTextNode({
      type: 'text',
      content: '',
      style: [] as FormatType[],
    });
    root.prepend(data.node);
    res.push(data);
  }

  return res as T extends true ? InputNodeElement[] : InputNode[];
}

export function getContentLength(content: InputNode[]): number {
  let res = 0;
  for (const i of content) res += i.type === 'text' ? i.content.length : 1;
  return res;
}

/**
 * @param content The array of nodes to search in
 * @param node The node to search for
 * @param offset Offset in the node itself
 * @returns The character where the node is located with the offset added, or -1 if the node was not found in the content
 */
export function getCharAtNode(
  content: InputNodeElement[],
  node: InputNodeElement,
  offset: number
): number {
  const index = content.indexOf(node);
  if (index === -1) return -1;
  else if (index === 0) return offset;

  let res = node.type === 'text' ? offset : 0;

  for (let i = 0; i < index; i++) {
    if (content[i].type !== 'text') res += 1;
    else res += content[i].content.length;
  }

  return res;
}

/**
 * @param content The array of nodes to search in, needs to have at least one item
 * @param char The character at which to find the node, or undefined to use the last node
 * @param anchor The other end off the selection, if specified it will correct the node to conform to selection
 * @returns The node at the character, or the last item if it was not found
 */
export function getNodeAtChar(
  content: InputNodeElement[],
  char?: number,
  anchor?: number
): InputNodeSelection {
  let node: InputNodeElement | undefined = undefined;
  let remain = 0,
    index = 0;
  if (char && char < 0) char = getContentLength(content) + char;
  else if (char === undefined) char = getContentLength(content);

  if (char === 0) node = content[0];
  else {
    let c = char;
    for (let i = 0; i < content.length; i++) {
      c -= content[i].type === 'text' ? content[i].content.length : 1;
      if (c === 0) {
        if (anchor !== undefined && char < anchor) {
          node = content[i + 1];
          index = i + 1;
          break;
        } else if (anchor !== undefined && char >= anchor) {
          node = content[i];
          remain = node.type === 'text' ? node.content.length : 1;
          index = i;
          break;
        }
      } else if (c < 0) {
        node = content[i];
        index = i;
        remain = content[i].content.length + c;
        break;
      }
    }
  }

  if (node === undefined) {
    node = content[content.length - 1];
    index = content.length - 1;
  }

  return {
    ...node,
    char: remain,
    index,
  };
}

function clean(nodeList: NodeListOf<ChildNode>): ChildNode[] {
  let res: ChildNode[] = [];

  for (const node of Array.from(nodeList)) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node as Element).tagName === 'BR'
    )
      break;
    else res.push(node);
  }

  return res;
}
