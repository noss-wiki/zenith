<script setup lang="ts">
import type { BlockInstance } from '@/composables/block';
import type { BlockDescription } from '@/composables/block';

const { instance } = defineProps<{
  options: BlockDescription;
  id: string;
  instance: BlockInstance;
}>();
</script>

<template>
  <div
    :class="`noss-selectable noss-${options.type}-block`"
    :data-block-id="$props.id"
    @mouseenter="instance.hover.value = true"
    @mouseleave="instance.hover.value = false"
  >
    <slot />
  </div>
</template>

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
