<script setup lang="ts">
import MaterialSymbol from './icons/MaterialSymbol.vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary';
    icon: string;
  }>(),
  {
    variant: 'primary',
  }
);

const background =
  props.variant === 'primary' ? 'var(--background)' : 'var(--hover-secondary)';
</script>

<template>
  <div class="link">
    <MaterialSymbol :symbol="$props.icon" />
    <slot />
  </div>
</template>

<style scoped>
.link {
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  padding-inline: 0.5rem;
  cursor: pointer;
  gap: 0.5rem;
  transition: background 0.3s ease, color 0.3s ease;
  font-weight: 500;
  color: var(--link-inactive);

  &:hover {
    background: v-bind('background');
    color: var(--text);
  }
}
</style>
