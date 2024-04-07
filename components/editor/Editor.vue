<script setup lang="ts">
import { Editor } from '@/composables/editor';
import MaterialSymbol from '../icons/MaterialSymbol.vue';

let root: HTMLDivElement;
let editor: Editor;

onMounted(() => (editor = new Editor(root)));
onUnmounted(() => editor.unmount());

const actions = useHandleActions();
</script>

<template>
  <div class="editor" ref="root" noss-editor-root>
    <div class="header"></div>
    <div class="content" noss-editor-content></div>
    <!-- wrap in component and add context menu -->
    <div class="handle" noss-editor-handle>
      <Button surface icon-only small transparent tooltip>
        <MaterialSymbol symbol="add" />
        <Tooltip>
          <div><strong>Click</strong> to add below</div>
          <!-- doesn't fit in tooltip: <div><strong>Shift-Click</strong> to add above</div> -->
        </Tooltip>
      </Button>
      <Button
        surface
        icon-only
        small
        transparent
        tooltip
        @click="actions.select"
      >
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
  --offset-top: 0px;

  position: absolute;
  top: calc(14rem + var(--offset-top));
  left: -3.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem 0 0.25rem;
  height: 1.5rem;
  width: 3.75rem;
  padding: 0 0.25rem;
  opacity: 1;
  transition: top 0.3s ease, opacity 0.3s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
