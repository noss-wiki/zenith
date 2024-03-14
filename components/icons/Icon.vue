<template>
  <div class="icon-wrapper">
    <slot />
  </div>
</template>

<style>
div.icon-wrapper {
  display: grid;
  place-items: center;
  width: 3rem;
  height: 3rem;
  transition: background 0.3s ease;

  &:hover {
    background: var(--background);
  }
}
</style>
