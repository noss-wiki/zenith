<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
:root {
  --background: #17191c;
  --surface: #0f1215;
  --hover: #1f2023;
  --text: #c7c7c7;
  --link-inactive: #818c98;
  --icon-inactive: #45525f;
  --accent: #5566b8; /* This should be editable by user */
  --accent-dim: rgba(85, 102, 184, 0.25);
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--background);
  color: var(--text);
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
</style>
