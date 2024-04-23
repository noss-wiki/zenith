<script lang="ts">
import { BlockInstance } from '@/composables/blocks/instance';
import icon from '@/assets/icons/blocks/header.svg?raw';

export class HeaderInstance extends BlockInstance {
  static readonly meta: BlockDescription = {
    name: 'Heading 1',
    description: 'The largest heading',
    type: 'header',
    category: 'simple_text',
    icon,
  };
}

export const meta = HeaderInstance.meta;
</script>

<script setup lang="ts">
import type { BlockDescription } from '@/composables/blocks';
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
