<script setup lang="ts">
import WorkspaceSelect from '@/components/WorkspaceSelect.vue';

const open = ref(true);
const hover = ref(false);
</script>

<template>
  <div class="wrapper">
    <nav class="editor-nav" :class="{ collapsed: !open, hover }">
      <div class="top">
        <Transition name="workspace-select">
          <WorkspaceSelect v-show="open" width="calc(var(--width) + 3.5rem)" />
        </Transition>
        <Button icon-only transparent large class="collapse-btn">
          <MaterialSymbol symbol="keyboard_double_arrow_left" />
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
      <Account expandable :icon-only="!open" />
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
  transition: width 0.3s ease;

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

  [data-reduced-motion] & {
    transition: none;
  }

  &.collapsed {
    width: 4rem;
  }
}

main {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.collapse-btn {
  transition: rotate 0.3s ease;

  [data-reduced-motion] & {
    transition: none;
  }

  nav.collapsed & {
    rotate: 180deg;
  }
}

.workspace-select-enter-active,
.workspace-select-leave-active {
  transition: width 0.3s ease;
  overflow: hidden;

  [data-reduced-motion] & {
    transition: none;
  }
}

.workspace-select-enter-from,
.workspace-select-leave-to {
  width: 0;
}
</style>
