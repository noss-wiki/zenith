<script setup>
import '@/assets/styles/variables.css';
</script>

<template>
  <div class="dark">
    <NuxtPage />
  </div>
</template>

<style scoped>
div {
  width: 100vw;
  height: 100vh;
}
</style>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: 'Poppins', sans-serif;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.link {
  font-weight: 500;
}
</style>
