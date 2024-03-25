<script setup lang="ts">
import { Editor } from '@/composables/editor';
import TextBlock from './blocks/TextBlock.vue';

let root: HTMLDivElement;
let editor: Editor;

onMounted(() => (editor = new Editor(root)));
onUnmounted(() => editor.unmount());
</script>

<template>
  <div class="editor" ref="root" noss-editor-root>
    <div class="header"></div>
    <div class="content" noss-editor-content></div>
  </div>
</template>

<style scoped>
.editor {
  padding-top: 14rem;
  width: 60rem;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
