<script setup lang="ts">
import type { BlockInstance } from '@/composables/blocks';

const props = defineProps<{
  instance: BlockInstance;
}>();

if (typeof props.instance._input !== 'function')
  throw new Error('Input paramater is not of type function');

let text: HTMLParagraphElement;
let textNode = document.createTextNode('');

const index = props.instance._input({
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
});
</script>

<template>
  <p
    data-content-editable-leaf="true"
    contenteditable="true"
    :data-input-index="index"
    ref="text"
  >
    <br />
  </p>
</template>

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
@/composables/blocks
