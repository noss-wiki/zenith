<script lang="ts">
export const options: BlockDescription = {
  name: 'Text',
  description: 'Simple plain text',
  type: 'text',
};
</script>

<script setup lang="ts">
import type { BlockDescription } from '@/composables/block';
import { BlockInstance } from '@/composables/block';
import Input from '../elements/Input.vue';
import Block from '../elements/Block.vue';

const instance = new BlockInstance(options);
</script>

<template>
  <Block :options="options" :id="instance.id">
    <Input :index="0" />
  </Block>
</template>

<style scoped>
.noss-text-block {
  background: var(--color-editor-active-block);
  font-size: 1em;
  font-weight: 400;
}
</style>
