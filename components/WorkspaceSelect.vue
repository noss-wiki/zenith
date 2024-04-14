<script setup lang="ts">
import { useWorkspaces } from '@/composables/workspace';
import Workspace from './Workspace.vue';

import Arrow from '@/assets/icons/arrow.svg';

withDefaults(
  defineProps<{
    width?: string;
  }>(),
  {
    width: '100%',
  }
);

const workspaces = useWorkspaces();
const open = ref(false);
</script>

<template>
  <div class="wrapper">
    <div class="button" ref="button" @click.stop="open = true">
      <Workspace />
      <Button icon-only transparent large>
        <Arrow />
      </Button>
    </div>
    <Transition mode="in-out" name="fade">
      <FunctionalPopup v-model="open" class="dropdown">
        <div class="workspaces">
          <div class="top-row">
            <span class="link">Workspaces</span>
            <Button icon-only transparent small surface>
              <MaterialSymbol symbol="add" />
            </Button>
          </div>
          <Workspace
            v-for="workspace in workspaces.list"
            :workspace="workspace"
            hover="var(--color-hover-raised-surface)"
            more-info
          />
        </div>
        <div class="line"></div>
        <div class="links">
          <Button surface transparent>
            <MaterialSymbol symbol="dashboard" />
            Dashboard
          </Button>
          <Button surface transparent>
            <MaterialSymbol symbol="settings" />
            Settings
          </Button>
          <Button surface transparent>
            <MaterialSymbol symbol="logout" />
            Log out
          </Button>
        </div>
      </FunctionalPopup>
    </Transition>
  </div>
</template>

<style scoped>
.wrapper {
  --width: max(12rem, min(100%, 20rem));

  width: var(--width);
  position: relative;
}

.button {
  height: 3rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-radius: var(--radius-default);
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--color-bg);
  }
}

.dropdown {
  position: absolute;
  top: 3.5rem;
  left: 0;
  width: v-bind('$props.width');
  background: var(--color-raised-surface);
  border-radius: var(--radius-default);
  display: flex;
  flex-direction: column;
}

.dropdown .workspaces {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;

  & .top-row {
    display: flex;
    justify-content: space-between;
    margin: 0.25rem;
  }
}

.dropdown .line {
  width: 100%;
  height: 1px;
  background: var(--color-inactive-dimmed);
}

.dropdown .links {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateY(-2rem) scale(0.8);
}
</style>
