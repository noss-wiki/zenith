<script setup lang="ts">
const props = defineProps<{
  // modifiers
  // TODO: check for contrast and change text color accordingly
  color?: Color;
  link?: string;
  // styles
  large?: boolean;
  surface?: boolean;
  outline?: boolean;
  transparent?: boolean;
  // layout
  'icon-only'?: boolean;
}>();

const color = computed(() => {
  if (typeof props.color === 'string') {
    if (colors[props.color]) return colors[props.color];
    else return props.color;
  } else return colors.inactive;
});

/* const textColor =
  props.transparent || props.outline ? color : 'var(--color-inactive)';

const hoverColor = color;

const background = (() => {
  if (props.outline || props.transparent) return 'transparent';
  else return color;
})();

const hoverBackground = (() => {
  if (props.outline) return 'transparent';
  else if (props.transparent) {
    if (props.surface) return colors.hoverSecondary;
    else return colors.hoverSurface;
  } else return hoverColor;
})(); */
</script>

<template>
  <div
    class="btn"
    :class="{
      'btn-large': large,
      'btn-surface': surface,
      'btn-outline': outline,
      'btn-transparent': transparent,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.btn {
  width: 100%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-inline: 0.75rem;

  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;

  transition: color 0.3s ease, background 0.3s ease, filter 0.3s ease;
  color: var(--color-inactive);
  background: v-bind('color');
  filter: none;

  &:hover {
    color: var(--color-text);
  }
}

.btn-large {
  height: 3rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid v-bind('color');
  color: v-bind('color');

  &:hover {
    color: v-bind('color');
    filter: var(--filter-hover);
  }
}

.btn-transparent {
  color: v-bind('color');
  background: transparent;

  &:hover {
    background: var(--color-bg);
    color: var(--color-text);
  }

  &.btn-surface:hover {
    background: var(--color-hover-raised-surface);
  }
}
</style>
