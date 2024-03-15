<template>
  <div class="wrapper">
    <slot />
  </div>
</template>

<style scoped>
div.wrapper {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 3rem;
  height: 3rem;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--background);
  }
}
</style>
