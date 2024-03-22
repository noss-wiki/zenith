<script setup lang="ts">
import { Editor } from '@/composables/editor';

let root: HTMLDivElement;
let editor: Editor;

onMounted(() => (editor = new Editor(root)));
onUnmounted(() => editor.unmount());
</script>

<template>
  <div class="editor" ref="root"></div>
</template>

<style scoped></style>
