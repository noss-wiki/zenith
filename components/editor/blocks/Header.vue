<script lang="ts">
import icon from '@/assets/icons/blocks/header.svg?raw';

export const meta: BlockDescription = {
  name: 'Heading 1',
  description: 'The largest heading',
  type: 'header',
  category: 'simple_text',
  icon,
};
</script>

<script setup lang="ts">
import type { BlockDescription } from '@/composables/block';
import { BlockInstance } from '@/composables/block';
import Input from '../elements/Input.vue';
import Block from '../elements/Block.vue';

const instance = new BlockInstance(meta);
</script>

<template>
  <Block :options="meta" :id="instance.id">
    <Input :instance="instance" />
  </Block>
</template>

<style scoped>
.noss-header-block {
  font-size: 1.875em;
  font-weight: 600;
}
</style>
