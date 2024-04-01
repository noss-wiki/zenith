<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /**
     * The delay in miliseconds it takes for the tooltip to open on button hover
     * @default 600
     */
    delay?: number;
  }>(),
  {
    delay: 600,
  }
);

// TODO: This code shoul propably be moved to the button component

let tooltip: HTMLDivElement;
let timeout: number | null;
let timing = false;

const enter = () => {
  if (timing === true) return;
  timeout = window.setTimeout(() => {
    tooltip.classList.add('active');
  }, props.delay);
  timing = true;
};

const leave = () => {
  if (typeof timeout !== 'number') return;
  window.clearTimeout(timeout);
  tooltip.classList.remove('active');
  timing = false;
};

let parent: HTMLElement | undefined;

onMounted(() => {
  parent =
    tooltip.parentElement && tooltip.parentElement.classList.contains('btn')
      ? tooltip.parentElement
      : undefined;
  if (!parent) return;
  parent.addEventListener('mouseenter', enter);
  parent.addEventListener('mouseleave', leave);
});

onUnmounted(() => {
  if (!parent) return;
  parent.removeEventListener('mouseenter', enter);
  parent.removeEventListener('mouseleave', leave);
});
</script>

<template>
  <div class="tooltip" ref="tooltip">
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
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
  padding: 0.25rem;
  width: 8rem;
  background: var(--color-hover-surface);
  font-size: 0.75em;
}
</style>

<style>
.btn > .tooltip {
  top: calc(var(--size) + 0.5rem);
  left: 50%;
  translate: -50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  border-radius: var(--radius-small);
}

.btn > .tooltip.active {
  opacity: 1;
}

.btn-surface > .tooltip {
  background: var(--color-hover-raised-surface);
}
</style>
