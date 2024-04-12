<script setup lang="ts">
const props = defineProps<{
  // modifiers
  // TODO: check for contrast and change text color accordingly
  color?: Color;
  link?: string;
  // size
  large?: boolean;
  small?: boolean;
  // styles
  surface?: boolean;
  outline?: boolean;
  transparent?: boolean;
  // layout
  iconOnly?: boolean;
  tooltip?: boolean;
  dropdown?: boolean;
}>();

const color = computed(() => {
  if (typeof props.color === 'string') {
    if (colors[props.color]) return colors[props.color];
    else return props.color;
  } else return colors.inactive;
});

const background = computed(() => {
  if (typeof props.color === 'string') {
    if (colors[props.color]) return colors[props.color];
    else return props.color;
  } else return colors.hoverSurface;
});
</script>

<template>
  <div
    class="btn"
    :class="{
      'btn-large': large,
      'btn-small': small,
      'btn-surface': surface,
      'btn-outline': outline,
      'btn-transparent': transparent,
      'btn-icon-only': props.iconOnly,
      'btn-tooltip': tooltip,
      'btn-dropdown': dropdown,
    }"
  >
    <slot />
    <MaterialSymbol
      v-if="dropdown"
      symbol="chevron_right"
      style="margin-left: auto; margin-right: -0.25rem"
    />
  </div>
</template>

<style scoped>
.btn {
  --size: 2.5rem;
  --radius: var(--radius-default);

  width: 100%;
  height: var(--size);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-inline: 0.75rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease, background 0.3s ease, filter 0.3s ease;
  color: var(--color-inactive);
  background: v-bind('background');
  filter: none;
  user-select: none;

  &:hover {
    color: var(--color-text);
  }
}

.btn-large {
  --size: 3rem;
}

.btn-small {
  --size: 1.5rem;
  --radius: var(--radius-small);
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

.btn-icon-only {
  width: var(--size);
  padding: 0;
  justify-content: center;
  color: var(--color-text);
  flex-shrink: 0;
}
</style>

<style>
.btn-tooltip,
.btn-dropdown {
  position: relative;
}
</style>
