<script setup lang="ts">
import type { BlockInstance } from '@/composables/blocks';
import type { BlockDescription } from '@/composables/blocks';

const { id } = defineProps<{
  options: BlockDescription;
  id: string;
}>();

const [mouseenter, mouseleave] = useHandle(id);
</script>

<template>
  <div
    :class="`noss-selectable noss-${options.type}-block`"
    :data-block-id="$props.id"
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
@/composables/blocks@/composables/blocks
