<script setup lang="ts">
import type { BlockDescription } from '@/composables/block';
import Input from '../elements/Input.vue';
import Block from '../elements/Block.vue';

const options: BlockDescription = {
  name: 'Text',
  description: 'Simple plain text',
  type: 'text',
};
</script>

<template>
  <Block :options="options">
    <Input />
  </Block>
</template>

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
