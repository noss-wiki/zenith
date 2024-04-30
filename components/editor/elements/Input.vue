<script setup lang="ts">
import type { BlockInstance } from '@/composables/blocks';
import type {
  InputContent,
  InputData,
  AdvancedInputContent,
} from '@/composables/blocks/data';

const props = defineProps<{
  instance: BlockInstance;
}>();

if (typeof props.instance.register !== 'function')
  throw new Error('Incorrect instance argument provided');

let text: HTMLParagraphElement;
const textRef = ref<HTMLElement>();

function clean(nodeList: NodeListOf<ChildNode>): NodeListOf<ChildNode> {
  if (nodeList[nodeList.length - 1].nodeType === Node.TEXT_NODE) {
    let parent = nodeList[0].parentElement;
    parent?.removeChild(nodeList[nodeList.length - 1]);
    if (parent) return parent.childNodes;
  }
  return nodeList;
}

function getContent(): InputData {
  if (!text) return [];
  const res: InputData = [];

  for (const node of clean(text.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE)
      res.push({
        type: 'text',
        style: {},
        content: node.textContent ?? '',
      });
    else if (node.nodeType === Node.ELEMENT_NODE) {
      const ele = node as Element;
      if (ele.tagName === 'br') continue;
      if (ele.tagName === 'span' && ele.classList.contains('noss-text-node')) {
        res.push({
          type: 'text',
          style: {}, // get style
          content: ele.textContent ?? '',
        });
      }
    }
  }

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
): AdvancedInputContent | undefined {
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

  if (char === 0)
    return {
      ...content[0],
      char: 0,
      index: 0,
      node: text.childNodes[0] as Text | Element,
    };
  else if (char) {
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
  const length = data.type === 'text' ? data.content.length : 1;

  return {
    ...data,
    char: length,
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

// TODO: Add support for multiple textnodes in the p element; neede for inline blocks, like: inline equation, etc.
const res = props.instance.register('input', {
  ref: textRef,

  getContent() {
    return getContent();
  },

  focus(char) {
    const data = getDataAtChar(char);
    if (!data) return false;

    const block = text.childNodes[data.index];
    if (data.type === 'text') focusElement(block, data.char);
  },
  carry(data) {},

  import(data) {
    if (!text) return;
    text.innerHTML = '';

    for (const i of data) {
      if (i.type === 'text') text.appendChild(createTextNode(i));
      else {
        // add other blocks
      }
    }
  },
  export() {
    return getContent();
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

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
