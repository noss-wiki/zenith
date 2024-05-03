<script lang="ts">
import { description, BlockInstance } from '@/composables/blocks/instance';
import { SingleInputBlockInstance } from '@/composables/blocks/singleInput';
import icon from '@/assets/icons/blocks/task_list.svg?raw';

export class Instance extends BlockInstance {
  static readonly meta = description({
    name: 'Task list',
    description: 'Create a easy to-do list',
    type: 'task_list',
    category: 'list',
    inputs: 1,
    centerHandle: true,
    icon,
  } as const);

  checked = ref(false);
}
</script>

<script setup lang="ts">
import Input from '../elements/Input.vue';
import Block from '../elements/Block.vue';

const instance = new Instance();
onUnmounted(() => instance.unmount());

const { checked } = instance;
</script>

<template>
  <Block :meta="Instance.meta" :instance="instance">
    <Checkbox v-model="checked" />
    <Input class="input" :instance="instance" :class="{ checked }" />
  </Block>
</template>

<style scoped>
.noss-task_list-block {
  font-size: 1em;
  font-weight: 400;
  display: flex;
  gap: 0.5rem;

  & .input {
    transition: color 0.3s ease, text-decoration-color 0.3s ease;
    text-decoration: line-through;
    text-decoration-color: transparent;
  }

  & .checked {
    color: var(--color-inactive);
    text-decoration-color: var(--color-inactive);
  }
}
</style>
