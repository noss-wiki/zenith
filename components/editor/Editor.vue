<script setup lang="ts">
import { Editor } from '@/composables/editor';

let root: HTMLDivElement;
let editor: Editor;

onMounted(() => (editor = new Editor(root)));
onUnmounted(() => editor.unmount());
</script>

<template>
  <div class="editor" ref="root" noss-editor-root></div>
</template>

<style scoped>
.editor {
  padding-top: 14rem;
  width: 60rem;
  height: 100%;
}
</style>
