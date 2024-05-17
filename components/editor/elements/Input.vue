<script setup lang="ts">
import type { BlockInstance } from '@/composables/blocks';
import type {
  InputContent,
  InputData,
  NodeInputContent,
  AdvancedInputContent,
  FormatType,
} from '@/composables/blocks/data';
import { formatTypes } from '@/composables/blocks/data';
import {
  getContentLength,
  getCharAtNode,
  getNodeAtChar,
} from '@/composables/utils/content';
import { ExportReason } from '@/composables/blocks/hooks';

const props = defineProps<{
  instance: BlockInstance;
}>();

if (typeof props.instance.register !== 'function')
  throw new Error('Incorrect instance argument provided');

let text: HTMLParagraphElement;
const textRef = ref<HTMLElement>();

/**
 * Returns all elements before a \<br> element, or the end of the array
 */
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

function getContent<T extends boolean>(
  nodes?: T
): T extends true ? NodeInputContent[] : InputData {
  if (!text) return [];
  const res: (InputContent & { node?: Node })[] = [];
  nodes ??= false as T;

  for (const node of clean(text.childNodes)) {
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
    const data = {
      type: 'text',
      content: '',
      style: [] as FormatType[],
    } as const;
    const node = createTextNode(data);
    text.prepend(node);
    res.push({
      ...data,
      node,
    });
  }

  return res as T extends true ? NodeInputContent[] : InputData;
}

function* peekIter(
  content: NodeInputContent[]
): Generator<
  [NodeInputContent, NodeInputContent | undefined, () => void],
  void,
  unknown
> {
  for (let i = 0; i < content.length; i++) {
    const curr = content[i];
    if (!curr) break;
    const next = content[i + 1];
    yield [
      curr,
      next,
      () => {
        content.splice(i + 1, 1);
      },
    ];
  }
}

/**
 * Checks if two of the same nodes are next to each other and merges them
 */
function cleanSameNodes(content: NodeInputContent[] = getContent(true)) {
  for (const [curr, next, deleteNext] of peekIter(content)) {
    if (curr.type !== 'text' || !next || next.type !== 'text') continue;
    if (!compareStyles(curr.style, next.style)) continue;
    // nodes are the same; can be merged
    curr.content += next.content;
    curr.node.textContent = curr.content;
    text.removeChild(next.node);
    deleteNext();
  }
}

function createTextNode(data: InputContent): Text | Element {
  if (data.style.length === 0) return document.createTextNode(data.content);

  const res = document.createElement('span');
  res.textContent = data.content;
  res.className = 'noss-text-node';
  for (const i of data.style) res.classList.add(i);

  return res;
}

function appendAtIndex<T extends Text | Element>(index: number, element: T): T {
  const beforeNode = text.childNodes[index];
  if (!beforeNode) text.appendChild(element);
  else text.insertBefore(element, beforeNode);
  return element;
}

function appendBeforeEnd(element: Text | Element) {
  const last = text.childNodes[text.childNodes.length - 1];
  if ((last as Element).tagName === 'BR') {
    text.removeChild(last);
    text.append(element, last);
  } else text.appendChild(element);
}

function* contentIter(
  content: InputData
): Generator<[InputContent, number], void, unknown> {
  for (let i = 0; i < content.length; i++) {
    yield [content[i], i];
  }
}

function focusElement(node: Text | Element | Node, start: number) {
  const range = document.createRange();
  const sel = window.getSelection();
  if (!sel) return;

  range.setStart(node, start);
  range.collapse(true);
  sel.removeAllRanges();
  setTimeout(() => {
    sel.addRange(range);
  }, 1);
}

function focusNodes(
  startNode: Element | Text | Node,
  endNode: Element | Text | Node,
  startChar: number = 0,
  endChar?: number,
  reversed: boolean = false
) {
  const range = document.createRange();
  const sel = window.getSelection();
  if (!sel) return;

  if (
    startNode.nodeType === Node.ELEMENT_NODE &&
    (startNode as Element).tagName === 'SPAN'
  )
    startNode = startNode.childNodes[0];
  if (
    endNode.nodeType === Node.ELEMENT_NODE &&
    (endNode as Element).tagName === 'SPAN'
  )
    endNode = endNode.childNodes[0];

  endChar ??= endNode.textContent?.length ?? 0;

  if (reversed) {
    range.setStart(endNode, endChar);
    range.collapse(true);
  } else {
    range.setStart(startNode, startChar);
    range.setEnd(endNode, endChar);
  }

  sel.removeAllRanges();
  setTimeout(() => {
    sel.addRange(range);
    if (reversed) sel.extend(startNode, startChar);
  }, 1);
}

function compareStyles(style1: FormatType[], style2: FormatType[]): boolean {
  if (style1.length !== style2.length) return false;
  for (let i = 0; i < style1.length; i++) {
    if (!style2.includes(style1[i])) return false;
  }
  return true;
}

function addToStyle(style: FormatType[], add: FormatType): FormatType[] {
  style = style.slice();
  if (!style.includes(add)) {
    style.push(add);
    return style;
  }
  style.splice(style.indexOf(add), 1);
  return style;
}

const res = props.instance.register('input', {
  ref: textRef,
  getContent(nodes) {
    return getContent(nodes);
  },
  focus(char) {
    const content = getContent(true);
    if (typeof char === 'number') {
      const data = getNodeAtChar(content, char);

      const block = text.childNodes[data.index];
      if (data.type === 'text') focusElement(block, data.char);
    } else if (char === undefined) {
      // focus last
      const node = content[content.length - 1];
      if (node.type === 'text') focusElement(node.node, node.content.length);
    } else if (char !== undefined) {
      const start = char.start < char.end ? char.start : char.end;
      const end = start === char.start ? char.end : char.start;
      const reversed = start === char.end;

      let startNode = getNodeAtChar(content, start);
      let endNode = getNodeAtChar(content, end);

      focusNodes(
        startNode.node,
        endNode.node,
        startNode.char,
        endNode.char,
        reversed
      );
    }
  },
  carry(data) {
    const content = getContent(true);
    const last = content[content.length - 1];

    if (
      last &&
      last.type === 'text' &&
      data[0].type === 'text' &&
      compareStyles(last.style, data[0].style)
    ) {
      last.content += data[0].content;
      last.node.textContent = last.content;
      data.splice(0, 1);
    }

    for (const i of data) {
      if (i.type === 'text') appendBeforeEnd(createTextNode(i));
      else {
        // add other blocks
      }
    }
  },
  format(format) {
    if (format.start === format.end) return;
    // correct order
    const start = format.start < format.end ? format.start : format.end;
    const end = start === format.start ? format.end : format.start;
    const reversed = start === format.end;
    let startChar = 0;
    let endChar = undefined;

    let content = getContent(true);
    let startNode = getNodeAtChar(content, start, end);
    let endNode = getNodeAtChar(content, end, start);

    if (
      (startNode.type === 'text' && start === startNode.content.length) || // end of text node
      (startNode.type !== 'text' && start === 1) // end of non-text node
    )
      startNode = {
        ...content[startNode.index + 1],
        char: 0,
        index: startNode.index + 1,
        node: text.childNodes[startNode.index + 1] as Element | Text,
      };

    if (startNode.index === endNode.index) {
      // same node
      if (startNode.type !== 'text') return; // non-text node can't be formatted
      if (endNode.char === startNode.content.length && startNode.char === 0) {
        // entire node is selected
        const style = addToStyle(startNode.style, format.type);
        if (style.length === 0 || startNode.style.length === 0) {
          // node needs to be replaced
          appendAtIndex(
            startNode.index,
            createTextNode({
              type: 'text',
              content: startNode.content,
              style: style,
            })
          );
          text.removeChild(startNode.node);
        } else {
          // only style needs to be updated
          const span = startNode.node as HTMLSpanElement;
          span.className = 'noss-text-node';
          for (const i of style) span.classList.add(i);
        }
      } else if (endNode.char === startNode.content.length) {
        // Last char is at the end of current node
        // > Node can be split in two

        startNode.node.textContent = startNode.content.slice(0, startNode.char);
        appendAtIndex(
          startNode.index + 1,
          createTextNode({
            type: 'text',
            content: startNode.content.slice(startNode.char),
            style: addToStyle(startNode.style, format.type),
          })
        );
      } else if (startNode.char === 0) {
        // First char is at the beginning of current node
        // > Node can be split in two

        startNode.node.textContent = startNode.content.slice(endNode.char);
        appendAtIndex(
          startNode.index,
          createTextNode({
            type: 'text',
            content: startNode.content.slice(0, endNode.char),
            style: addToStyle(startNode.style, format.type),
          })
        );
      } else {
        // somewhere in the middle of the node
        // > Node needs to be split in three
      }
    } else {
      // not same node
    }

    // makes focussing not work correctly
    cleanSameNodes();

    // focus correct nodes
    content = getContent(true);
    startNode = getNodeAtChar(content, start);
    endNode = getNodeAtChar(content, end);
    if (
      startNode.type === 'text' &&
      startNode.char === startNode.content.length &&
      content[startNode.index + 1] !== undefined
    )
      startNode = {
        ...content[startNode.index + 1],
        char: 0,
        index: startNode.index + 1,
        node: text.childNodes[startNode.index + 1] as Element | Text,
      };

    focusNodes(startNode.node, endNode.node, startChar, endChar, reversed);
  },
  import(data) {
    if (!text) return;
    text.innerHTML = '';

    for (const i of data.content) {
      if (i.type === 'text') text.appendChild(createTextNode(i));
      else {
        // add other blocks
      }
    }

    text.appendChild(document.createElement('br'));
  },
  export(reason, char) {
    if (reason !== ExportReason.Carry) return getContent();
    char ??= 0;

    const content = getContent(true);
    const data = getNodeAtChar(content, char);
    let res: InputData = content.slice(data.index + 1);
    for (let i = data.index; i < content.length; i++)
      text.removeChild(text.childNodes[i]);

    if (data.type !== 'text')
      res.unshift({
        type: data.type,
        style: data.style,
        content: data.content,
      });
    else {
      res.unshift({
        type: 'text',
        style: data.style,
        content: data.content.slice(data.char).trim(),
      });
      appendBeforeEnd(
        createTextNode({
          type: 'text',
          style: data.style,
          content: data.content.slice(0, data.char).trim(),
        })
      );
    }

    return res;
  },
});

onMounted(() => {
  textRef.value = text;
});
onUnmounted(() => res?.deregister());
</script>

<template>
  <p
    data-content-editable-leaf="true"
    contenteditable="true"
    :data-input-index="res?.index"
    ref="text"
  >
    <br />
  </p>
</template>

<style>
[data-content-editable-leaf] .accent {
  --color: var(--color-primary);

  color: var(--color);
}

[data-content-editable-leaf] .bold {
  font-weight: 700;
}

[data-content-editable-leaf] .italic {
  font-style: italic;
}

[data-content-editable-leaf] .strike-through {
  text-decoration: line-through;
}

[data-content-editable-leaf] .underline {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    background: var(--color, var(--color-text));
    width: 100%;
    height: 2px;
  }
}
</style>
