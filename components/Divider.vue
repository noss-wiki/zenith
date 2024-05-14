<script setup lang="ts">
import type { Editor } from '@/composables/editor';

defineProps<{
  /**
   * Set to true to add padding around the line
   */
  menu?: boolean;
  vertical?: boolean;
}>();
</script>

<template>
  <div
    class="divider"
    :class="{
      menu,
      vertical,
    }"
  ></div>
</template>

<style scoped>
.divider {
  background: var(--color-inactive-dimmed);
  height: 1px;
  width: 100%;
  flex-shrink: 0;

  &.menu {
    margin: 0.5rem 0;
  }

  &.vertical {
    width: 1px;
    height: 100%;
  }
}
</style>
