<script setup lang="ts">
import WorkspaceSelect from './WorkspaceSelect.vue';
</script>

<template>
  <div class="editor">
    <nav class="editor-nav">
      <div class="top">
        <WorkspaceSelect />
      </div>
    </nav>
  </div>
</template>

<style scoped>
.editor {
  width: 100vw;
  height: 100vh;
  display: flex;
}

nav {
  height: 100%;
  width: 20rem;
  background: var(--surface);
  display: flex;
  flex-direction: column;

  & > .top {
    display: flex;
    margin: 0.5rem;
  }
}
</style>
