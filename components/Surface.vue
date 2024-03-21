<script setup lang="ts">
withDefaults(
  defineProps<{
    fill?: boolean;
    radius?: string;
  }>(),
  {
    fill: false,
    radius: '0.5rem',
  }
);
</script>

<template>
  <div
    :class="$style.surface"
    :style="{
      height: $props.fill ? '100%' : '',
      width: $props.fill ? '100%' : '',
    }"
  >
    <slot />
  </div>
</template>

<style module>
.surface {
  background: var(--color-surface);
  border-radius: v-bind('$props.radius');
}
</style>
