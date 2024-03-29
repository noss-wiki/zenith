<script setup lang="ts">
import type { BlockInstance } from '@/composables/block';

const props = defineProps<{
  input: BlockInstance['input'];
}>();

if (typeof props.input !== 'function')
  throw new Error('Input paramater is not of type function');

let text: HTMLParagraphElement;
let textNode = document.createTextNode('');

const index = props.input({
  get content(): string {
    return textNode?.textContent ?? '';
  },

  set content(data: string) {
    if (textNode && text && !text.contains(textNode)) {
      text.innerHTML = '';
      text.append(textNode, document.createElement('br'));
    }
    if (textNode) textNode.data = data;
    else if (text) {
      text.innerHTML = data;
    }
  },

  focus(char?: number) {
    if (!text) return;
    if (typeof char !== 'number' || char > this.content.length)
      char = this.content.length;
    else if (char < 0) char = Math.min(0, this.content.length + char);

    if (!textNode) return;
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
