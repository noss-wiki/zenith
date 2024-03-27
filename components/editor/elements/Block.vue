<script setup lang="ts">
import type { BlockDescription } from '@/composables/block';

defineProps<{
  options: BlockDescription;
  id: string;
}>();
</script>

<template>
  <div
    :class="`noss-selectable noss-${options.type}-block`"
    :data-block-id="$props.id"
  >
    <slot />
  </div>
</template>

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
