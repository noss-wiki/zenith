<script setup lang="ts">
import type { BlockInstance } from '@/editor/blocks';
import type { BlockDescription } from '@/editor/blocks';

const props = defineProps<{
  instance: BlockInstance;
  meta: BlockDescription;
}>();

const [mouseenter, mouseleave] = useHandle(props.instance.id);
</script>

<template>
  <div
    :class="`noss-selectable noss-${meta.type}-block`"
    :data-block-id="$props.instance.id"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <slot />
  </div>
</template>

<style scoped>
.noss-selectable {
  isolation: isolate;
  position: relative;
  transition: 0.3s ease background;

  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: calc(0px - var(--block-hover-padding));
    width: calc(100% + calc(var(--block-hover-padding) * 2));
    height: 100%;
  }
}

.noss-selectable.selected {
  background: var(--color-editor-active-block);
}
</style>
