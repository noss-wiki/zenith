<script setup lang="ts">
import type { Editor } from '@/composables/editor';
import type { VNodeRef } from 'vue';

const { instance } = defineProps<{
  instance: Editor;
}>();

let handle = ref<HTMLElement>();
const component = instance.attach('handle');
onMounted(() => component.mount(handle));
onUnmounted(() => instance.detach(component));
</script>

<template>
  <div class="handle hidden" noss-editor-handle ref="handle">
    <Button
      surface
      icon-only
      small
      transparent
      tooltip
      @click="
        (e: MouseEvent) => {
          if (e.shiftKey) component.addAbove();
          else component.addBelow();
        }
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
      @click="() => component.select()"
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
  top: calc(var(--offset-top));
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
