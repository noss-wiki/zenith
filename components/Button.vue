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
  square?: boolean;
  // layout
  iconOnly?: boolean;
  tooltip?: boolean;
  /**
   * The delay in miliseconds it takes for the tooltip to open on button hover
   * @default 600
   */
  tooltipDelay?: number;
  dropdown?: boolean;
}>();

let button: HTMLElement;

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

// tooltip
const delay = props.tooltipDelay ?? 600;
let tooltip: HTMLDivElement | null = null;
let timeout: number | null;
let timing = false;

const enter = () => {
  if (!tooltip || timing === true) return;
  timeout = window.setTimeout(() => {
    tooltip?.classList.add('active');
  }, delay);
  timing = true;
};

const leave = () => {
  if (typeof timeout !== 'number' || !tooltip) return;
  window.clearTimeout(timeout);
  tooltip.classList.remove('active');
  timing = false;
};

onMounted(() => {
  if (!props.tooltip || !button) return;
  tooltip = button.querySelector('.tooltip');
  if (!tooltip) return;
  button.addEventListener('mouseenter', enter);
  button.addEventListener('mouseleave', leave);
});

onUnmounted(() => {
  if (!button) return;
  button.removeEventListener('mouseenter', enter);
  button.removeEventListener('mouseleave', leave);
});
</script>

<template>
  <div
    class="btn"
    role="button"
    ref="button"
    :class="{
      'btn-large': large,
      'btn-small': small,
      'btn-surface': surface,
      'btn-outline': outline,
      'btn-transparent': transparent,
      'btn-icon-only': props.iconOnly,
      'btn-tooltip': props.tooltip,
      'btn-dropdown': dropdown,
      'btn-square': square,
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
  --color: var(--color-inactive);

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
  color: var(--color);
  fill: var(--color);
  background: v-bind('background');
  filter: none;
  user-select: none;

  &:hover {
    --color: var(--color-text);
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
  --color: v-bind('color');

  &:hover {
    --color: v-bind('color');

    filter: var(--filter-hover);
  }
}

.btn-transparent {
  --color: v-bind('color');

  background: transparent;

  &:hover {
    background: var(--color-bg);
    --color: var(--color-text);
  }

  &.btn-surface:hover {
    background: var(--color-hover-raised-surface);
  }
}

.btn-icon-only {
  width: var(--size);
  padding: 0;
  justify-content: center;
  flex-shrink: 0;
  --color: var(--color-text);
}

.btn-square {
  border-radius: 0;
}

.btn-tooltip,
.btn-dropdown {
  position: relative;
}
</style>
