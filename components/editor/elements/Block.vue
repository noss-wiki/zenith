<script setup lang="ts">
import type { BlockInstance } from '@/composables/block';
import type { BlockDescription } from '@/composables/block';

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
.noss-selectable.selected {
  background: var(--color-editor-active-block);
}
</style>
