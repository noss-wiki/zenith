<script setup lang="ts">
import type { VNodeRef } from 'vue';
import { useWorkspaces } from '@/composables/workspace';
import Arrow from '../icons/Arrow.vue';

const workspaces = useWorkspaces();
const open = ref(false);

let button: HTMLElement;
let dropdown: HTMLElement;

const handler = (e: MouseEvent) => {
  if (button.contains(e.target as Node)) open.value = !open.value;
  else if (!dropdown.contains(e.target as Node)) open.value = false;
};

onMounted(() => document.addEventListener('click', handler));
onUnmounted(() => document.removeEventListener('click', handler));
</script>

<template>
  <div class="wrapper">
    <div class="button" ref="button">
      <div class="info">
        <div class="icon"></div>
        <span>{{ workspaces.active.value.name }}</span>
      </div>
      <div class="drop-btn">
        <Arrow />
      </div>
    </div>
    <Transition mode="in-out" name="fade">
      <div class="dropdown" v-show="open" ref="dropdown"></div>
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
  border-radius: 0.5rem;
  transition: background 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--background);
  }
}

.info {
  margin: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  background: var(--accent);
  border-radius: 0.25rem;
  font-weight: 500;
}

.dropdown {
  position: absolute;
  top: 3.5rem;
  left: 0;
  width: 100%;
  height: 20rem;
  background: var(--hover);
  border-radius: 0.5rem;
}
</style>
