<script setup lang="ts">
import type { Editor } from '@/composables/editor';
import MaterialSymbol from '../icons/MaterialSymbol.vue';

const { editor } = defineProps<{
  editor: Editor;
}>();

const actions = useHandleActions(editor);
const { click } = useClickLevel();
</script>

<template>
  <div class="handle hidden" noss-editor-handle>
    <Button
      surface
      icon-only
      small
      transparent
      tooltip
      @click="
        click<MouseEvent>((e) => {
          if (e.shiftKey) actions.addAbove();
          else actions.addBelow();
        }).handler
      "
    >
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
      @click="click(actions.select).handler"
    >
      <MaterialSymbol symbol="drag_indicator" />
      <Tooltip>
        <div class="line"><strong>Drag</strong> to move</div>
        <div class="line"><strong>Click</strong> to select</div>
      </Tooltip>
    </Button>
  </div>
</template>

<style scoped>
.handle {
  --offset-top: 0px;

  position: absolute;
  z-index: 10;
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
