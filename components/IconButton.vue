<script setup lang="ts">
import MaterialSymbol from './icons/MaterialSymbol.vue';

const props = withDefaults(
  defineProps<{
    symbol?: string;
    size?: 'normal' | 'small';
  }>(),
  {
    symbol: 'search',
    size: 'normal',
  }
);

const size = props.size === 'normal' ? '3rem' : '1.5rem';
const radius = props.size === 'normal' ? '.5rem' : '.25rem';
</script>

<template>
  <div class="wrapper">
    <MaterialSymbol v-if="$props.symbol" :symbol="$props.symbol" />
  </div>
</template>

<style scoped>
div.wrapper {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: v-bind('size');
  height: v-bind('size');
  border-radius: v-bind('radius');
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--background);
  }
}
</style>
