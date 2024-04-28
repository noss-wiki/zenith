<script setup lang="ts">
import type { BlockInstance } from '@/composables/blocks';
import type { InputData } from '@/composables/blocks/data';

const props = defineProps<{
  instance: BlockInstance;
}>();

if (typeof props.instance.register !== 'function')
  throw new Error('Incorrect instance argument provided');

let text: HTMLParagraphElement;
let textNode = document.createTextNode('');

// TODO: Add support for multiple textnodes in the p element; neede for inline blocks, like: inline equation, etc.
const res = props.instance.register('input', {
  setContent(data: string) {
    if (textNode && text && !text.contains(textNode)) {
      text.innerHTML = '';
      text.append(textNode, document.createElement('br'));
    }
    if (textNode) textNode.data = data;
    else if (text) {
      text.innerHTML = data;
    }
  },
  getContent() {
    if (textNode && text && text.contains(textNode)) return textNode.data;
    else if (text)
      return text.childNodes[0].nodeType === 3
        ? (text.childNodes[0] as Text).data
        : '';
    else return '';
  },

  focus(char?: number) {
    if (!text) return;
    if (typeof char !== 'number' || char > this.getContent().length)
      char = this.getContent().length;
    else if (char < 0) char = this.getContent().length + char;
    if (char < 0) char = 0;

    if (textNode && text && !text.contains(textNode)) {
      textNode.data = this.getContent();
      text.innerHTML = '';
      text.append(textNode, document.createElement('br'));
    } else if (!textNode) return;

    const range = document.createRange();
    const sel = window.getSelection();
    if (!sel) return;

    range.setStart(textNode, char);
    range.collapse(true);
    sel.removeAllRanges();
    setTimeout(() => {
      sel.addRange(range);
    }, 1);
  },

  carry(data) {
    this.setContent(this.getContent() + data);
  },

  import(data) {},
  export() {
    const nodes = text.childNodes;
    const res: InputData = [];

    for (const node of nodes) {
      if (node.nodeType === 3)
        res.push({
          type: 'text',
          style: {},
          content: node.textContent ?? '',
        });
      else if (node.nodeType === 1) {
        const e = node as Element;
        // save styled text and inline blocks
      }
    }
    return res;
  },
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
