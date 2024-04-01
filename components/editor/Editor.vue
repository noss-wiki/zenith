<script setup lang="ts">
import { Editor } from '@/composables/editor';
import MaterialSymbol from '../icons/MaterialSymbol.vue';

let root: HTMLDivElement;
let editor: Editor;

onMounted(() => (editor = new Editor(root)));
onUnmounted(() => editor.unmount());
</script>

<template>
  <div class="editor" ref="root" noss-editor-root>
    <div class="header"></div>
    <div class="content" noss-editor-content></div>
    <div class="handle" noss-editor-handle>
      <Button surface icon-only small transparent>
        <MaterialSymbol symbol="add" />
        <Tooltip>
          <div><strong>Click</strong> to add below</div>
        </Tooltip>
      </Button>
      <Button surface icon-only small transparent>
        <MaterialSymbol symbol="drag_indicator" />
        <Tooltip>
          <div class="line"><strong>Drag</strong> to move</div>
          <div class="line"><strong>Click</strong> to select</div>
        </Tooltip>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.editor {
  padding-top: 14rem;
  width: 60rem;
  height: 100%;
  position: relative;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.handle {
  position: absolute;
  top: 14rem;
  left: -4.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  height: 1.5rem;
  width: 3.75rem;
  padding: 0 0.25rem;
}
</style>
