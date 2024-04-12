<script setup lang="ts">
import type { Editor } from '@/composables/editor';

defineProps<{
  /**
   * If this is in a menu, set this to true.
   * It adds negative padding of 0.5rem to both sides
   */
  menu?: boolean;
}>();
</script>

<template>
  <div
    class="divider"
    :class="{
      menu: $props.menu,
    }"
  ></div>
</template>

<style scoped>
.divider {
  background: var(--color-inactive-dimmed);
  height: 1px;
  width: 100%;

  &.menu {
    width: calc(100% + 1rem);
    margin: 0.5rem 0;
    margin-inline: -0.5rem;
  }
}
</style>
