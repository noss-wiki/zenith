<script lang="ts">
export const options: BlockDescription = {
  name: 'Text',
  description: 'Simple plain text',
  type: 'text',
};
</script>

<script setup lang="ts">
import type { BlockDescription } from '@/composables/block';
import Input from '../elements/Input.vue';
import Block from '../elements/Block.vue';
</script>

<template>
  <Block :options="options">
    <Input />
  </Block>
</template>

<style scoped>
.noss-text-block {
  background: var(--color-editor-active-block);
}
</style>
