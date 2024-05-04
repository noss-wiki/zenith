<script setup lang="ts">
import type { BlockInstance } from '@/composables/blocks';
import type {
  InputContent,
  InputData,
  AdvancedInputContent,
  InputContentStyle,
} from '@/composables/blocks/data';
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
): T extends true ? (InputContent & { node: Node })[] : InputData {
  if (!text) return [];
  const res: (InputContent & { node?: Node })[] = [];
  nodes ??= false as T;

  for (const node of clean(text.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE)
      if (nodes)
        res.push({
          type: 'text',
          style: {},
          content: node.textContent ?? '',
          node,
        });
      else
        res.push({
          type: 'text',
          style: {},
          content: node.textContent ?? '',
        });
    else if (node.nodeType === Node.ELEMENT_NODE) {
      const ele = node as Element;
      if (ele.tagName === 'BR') continue;
      if (ele.tagName === 'SPAN' && ele.classList.contains('noss-text-node')) {
        if (nodes)
          res.push({
            type: 'text',
            style: {}, // get style
            content: ele.textContent ?? '',
            node,
          });
        else
          res.push({
            type: 'text',
            style: {}, // get style
            content: ele.textContent ?? '',
          });
      }
    }
  }

  return res as T extends true ? (InputContent & { node: Node })[] : InputData;
}

function getContentLength(content: InputData): number {
  let res = 0;
  for (const i of content) res += i.type === 'text' ? i.content.length : 1;
  return res;
}

function createTextNode(data: InputContent): Text | Element {
  if (Object.keys(data.style).length === 0)
    return document.createTextNode(data.content);

  const res = document.createElement('span');
  res.textContent = data.content;
  res.className = 'noss-text-node';
  // apply style
  return res;
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

function getDataAtChar(
  char: number | undefined,
  content: InputData = getContent()
): AdvancedInputContent {
  if (content.length === 0) {
    text.prepend(
      createTextNode({
        type: 'text',
        style: {},
        content: '',
      })
    );
    content = getContent();
  }

  if (char && char < 0) char = getContentLength(content) + char;

  if (char === 0)
    return {
      ...content[0],
      char: 0,
      index: 0,
      node: text.childNodes[0] as Text | Element,
    };
  else if (char !== undefined) {
    for (const [node, i] of contentIter(content)) {
      if (node.type === 'text') char -= node.content.length;
      else char -= 1;

      if (char <= 0)
        return {
          ...node,
          char: node.content.length + char,
          index: i,
          node: text.childNodes[i] as Text | Element,
        };
    }
  }

  const data = content[content.length - 1];
  const offset = data.type === 'text' ? data.content.length : 1;

  return {
    ...data,
    char: offset,
    index: content.length - 1,
    node: text.childNodes[content.length - 1] as Text | Element,
  };
}

function focusElement(node: Text | Element | Node, index: number) {
  const range = document.createRange();
  const sel = window.getSelection();
  if (!sel) return;

  range.setStart(node, index);
  range.collapse(true);
  sel.removeAllRanges();
  setTimeout(() => {
    sel.addRange(range);
  }, 1);
}

function compareStyles(
  style1: InputContentStyle,
  style2: InputContentStyle
): boolean {
  if (Object.keys(style1).length !== Object.keys(style2).length) return false;
  for (const prop in style1) {
    if (
      style1[prop as keyof InputContentStyle] !==
      style2[prop as keyof InputContentStyle]
    )
      return false;
  }
  return true;
}

const res = props.instance.register('input', {
  ref: textRef,
  getContent(nodes) {
    return getContent(nodes);
  },
  focus(char) {
    const data = getDataAtChar(char);

    const block = text.childNodes[data.index];
    if (data.type === 'text') focusElement(block, data.char);
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

    const content = getContent();
    const data = getDataAtChar(char, content);
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
