<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    position?: 'top' | 'bottom' | 'left' | 'right';
    center?: boolean;
  }>(),
  {
    position: 'top',
    center: false,
  }
);
</script>

<template>
  <div
    class="tooltip"
    :class="{
      'tooltip-center': center,
    }"
    v-bind:class="props.position"
    ref="tooltip"
  >
    <slot />
  </div>
</template>

<style scoped>
.tooltip {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-hover-surface);
  font-size: 0.75em;

  &.tooltip-center {
    align-items: center;
    justify-content: center;
  }
}
</style>

<style>
.btn > .tooltip {
  top: unset;
  bottom: calc(var(--size) + 0.5rem);
  left: 50%;
  translate: -50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  border-radius: var(--radius-small);

  &.bottom {
    top: calc(var(--size) + 0.5rem);
    bottom: unset;
  }
}

.btn > .tooltip.active {
  opacity: 1;
}

.btn-surface > .tooltip {
  background: var(--color-hover-raised-surface);
}
</style>
