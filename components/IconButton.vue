<script setup lang="ts">
import MaterialSymbol from './icons/MaterialSymbol.vue';
//@ts-ignore
import Arrow from '@/assets/icons/arrow.svg';

const props = withDefaults(
  defineProps<{
    symbol?: string;
    icon?: 'arrow';
    size?: 'normal' | 'small';
    direction?: 'top' | 'bottom' | 'left' | 'right';
  }>(),
  {
    symbol: 'search',
    size: 'normal',
    direction: 'top',
  }
);

const size = props.size === 'normal' ? '3rem' : '1.5rem';
const radius = props.size === 'normal' ? '.5rem' : '.25rem';
const rotation = ref('0deg');

watchEffect(() => {
  rotation.value =
    props.direction === 'top'
      ? '180deg'
      : props.direction === 'left'
      ? '90deg'
      : props.direction === 'right'
      ? '270deg'
      : '0deg';
});
</script>

<template>
  <div class="wrapper">
    <div class="rotate" :style="{ rotate: rotation }">
      <Arrow v-if="$props.icon === 'arrow'" />
      <MaterialSymbol v-else-if="$props.symbol" :symbol="$props.symbol" />
    </div>
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
  transition: background 0.3s ease, rotate 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--background);
  }
}

.rotate {
  transition: rotate 0.3s ease;
}
</style>
