<script setup lang="ts">
import type { BlockDescription } from '@/composables/block';

defineProps<{
  options: BlockDescription;
}>();
</script>

<template>
  <div :class="`noss-selectable noss-${options.type}-block`">
    <slot />
  </div>
</template>

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
