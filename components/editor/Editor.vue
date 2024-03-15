<script setup lang="ts">
import WorkspaceSelect from '../WorkspaceSelect.vue';
import MaterialSymbol from '../icons/MaterialSymbol.vue';
import IconButton from '../IconButton.vue';
</script>

<template>
  <div class="editor">
    <nav class="editor-nav">
      <div class="top">
        <WorkspaceSelect width="calc(100% + 3.5rem)" />
        <IconButton symbol="keyboard_double_arrow_left" />
      </div>
      <div class="links">
        <div class="std-links">
          <NavLink icon="home">Home</NavLink>
          <NavLink icon="search">Search</NavLink>
          <NavLink icon="settings">Settings</NavLink>
        </div>
      </div>
      <Account expandable />
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
  padding: 0.5rem;

  & > .top {
    display: flex;
    gap: 0.5rem;
  }

  & .links {
    padding: 0.5rem 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
