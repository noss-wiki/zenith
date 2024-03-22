<script setup lang="ts">
import { useWorkspaces } from '@/composables/workspace';
import MaterialSymbol from './icons/MaterialSymbol.vue';
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
const direction = ref<'top' | 'bottom'>('bottom');

watchEffect(() => (direction.value = open.value === true ? 'top' : 'bottom'));

let button: HTMLElement;
let dropdown: HTMLElement;

const handler = (e: MouseEvent) => {
  if (button.contains(e.target as Node)) open.value = !open.value;
  else if (!dropdown.contains(e.target as Node)) {
    open.value = false;
  }
};

onMounted(() => document.addEventListener('click', handler));
onUnmounted(() => document.removeEventListener('click', handler));
</script>

<template>
  <div class="wrapper">
    <div class="button" ref="button">
      <Workspace />
      <Button icon-only transparent large>
        <Arrow />
      </Button>
    </div>
    <Transition mode="in-out" name="fade">
      <div class="dropdown" v-show="open" ref="dropdown">
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
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.wrapper {
  width: max(12rem, min(100%, 20rem));
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
