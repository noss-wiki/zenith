<script lang="ts">
import icon from '@/assets/icons/blocks/paragraph.svg?raw';
import { BlockInstance } from '@/composables/blocks/instance';

export class TextInstance extends BlockInstance {
  static readonly meta: BlockDescription = {
    name: 'Text',
    description: 'Simple plain text',
    type: 'text',
    category: 'simple_text',
    icon,
  };
}

export const meta = TextInstance.meta;
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
.noss-text-block {
  font-size: 1em;
  font-weight: 400;
}
</style>
