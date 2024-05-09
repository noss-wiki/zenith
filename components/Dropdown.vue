<script setup lang="ts">
withDefaults(
  defineProps<{
    position?: 'right' | 'left' | 'bottom';
  }>(),
  {
    position: 'right',
  }
);
</script>

<template>
  <div class="dropdown-menu" v-bind:class="position">
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dropdown-menu {
  position: absolute;
  right: -22rem;
  top: -1.5rem;
  display: flex;
  padding: 1rem;

  &.left {
    right: unset;
    left: -21rem;
  }

  &.bottom {
    right: unset;
    left: -1rem;
    top: calc(var(--size, 2.5rem));
  }
}

.content {
  background: var(--color-raised-surface);
  border-radius: var(--radius-default);
  width: 20rem;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}
</style>

<style>
.btn-dropdown > .dropdown-menu {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.dropdown-menu:hover,
.btn-dropdown:hover > .dropdown-menu {
  opacity: 1;
  pointer-events: initial;
}
</style>
