<script setup lang="ts"></script>

<template>
  <div class="dropdown-menu">
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dropdown-menu {
  position: absolute;
  right: -21rem;
  top: -0.5rem;
  display: flex;
  padding-left: 1rem;
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
  pointer-events: all;
}
</style>
