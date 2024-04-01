<script setup lang="ts">
import WorkspaceSelect from '@/components/WorkspaceSelect.vue';
import MaterialSymbol from '@/components/icons/MaterialSymbol.vue';
</script>

<template>
  <div class="wrapper">
    <nav class="editor-nav">
      <div class="top">
        <WorkspaceSelect width="calc(100% + 3.5rem)" />
        <Button icon-only transparent large>
          <MaterialSymbol symbol="keyboard_double_arrow_left" />
          <!-- <Tooltip> Collapse </Tooltip> -->
        </Button>
      </div>
      <div class="links">
        <div class="std-links">
          <Button transparent>
            <MaterialSymbol symbol="home" />
            Home
          </Button>
          <Button transparent>
            <MaterialSymbol symbol="search" />
            Search
          </Button>
          <Button transparent>
            <MaterialSymbol symbol="settings" />
            Settings
          </Button>
        </div>
      </div>
      <Account expandable />
    </nav>
    <main>
      <Editor />
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
}

nav {
  height: 100%;
  width: 22rem;
  flex-shrink: 0;
  background: var(--color-surface);
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

main {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  overflow-y: auto;
}
</style>
