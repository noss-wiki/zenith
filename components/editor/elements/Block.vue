<script setup lang="ts">
import type { BlockDescription } from '@/composables/block';

defineProps<{
  options: BlockDescription;
  id: string;
}>();

const hover = ref(false);
</script>

<template>
  <div
    :class="`noss-selectable noss-${options.type}-block`"
    :data-block-id="$props.id"
    :data-block-active="hover"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <slot />
  </div>
</template>

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
