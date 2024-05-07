<script setup lang="ts">
import { Editor } from '@/composables/editor';

let root: HTMLDivElement;
let editor = new Editor();

onMounted(() => editor.mount(root));
onUnmounted(() => editor.unmount());
</script>

<template>
  <div class="editor" ref="root" noss-editor-root>
    <div class="header"></div>
    <div class="content" noss-editor-content data-content-editable-host></div>
    <div class="handle">
      <EditorHandle :instance="editor" />
      <EditorActions :instance="editor" />
      <EditorSelectionMenu :instance="editor" />
    </div>
  </div>
</template>

<style scoped>
.editor {
  --block-hover-padding: 6rem;

  isolation: isolate;
  padding-top: 14rem;
  width: 60rem;
  height: 100%;
  position: relative;
}

.content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
