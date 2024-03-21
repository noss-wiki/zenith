<script setup lang="ts">
import type { Ref } from 'vue';
import type { Workspace } from '@/composables/workspace';

withDefaults(
  defineProps<{
    workspace?: Ref<Workspace>;
    moreInfo?: boolean;
    hover?: string;
  }>(),
  {
    workspace: () => useWorkspaces().active,
    moreInfo: false,
    hover: 'var(--color-bg)',
  }
);

const workspaces = useWorkspaces();
</script>

<template>
  <div class="info">
    <div class="icon"></div>
    <span class="name" v-if="moreInfo === false">{{
      $props.workspace?.value.name
    }}</span>
    <div class="info-stack" v-else>
      <span class="name">{{ $props.workspace?.value.name }}</span>
      <span class="members">{{ $props.workspace?.value.members }} members</span>
    </div>
  </div>
</template>

<style scoped>
.info {
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: v-bind('$props.hover');
  }
}

.icon {
  width: 2rem;
  height: 2rem;
  background: var(--color-primary);
  border-radius: 0.25rem;
  font-weight: 500;
}

.info-stack {
  display: flex;
  flex-direction: column;
}

span.name {
  font-weight: 500;
}

span.members {
  color: var(--color-inactive);
  font-size: 0.75rem;
  margin-top: -0.3rem;
}
</style>
