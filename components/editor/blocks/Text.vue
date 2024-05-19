<script lang="ts">
import { description, BlockInstance } from '@/editor/blocks/instance';
import icon from '@/assets/icons/blocks/paragraph.svg?raw';

export class Instance extends BlockInstance {
  static readonly meta = description({
    name: 'Text',
    description: 'Simple plain text',
    type: 'text',
    category: 'simple_text',
    inputs: 1,
    icon,
  } as const);
}
</script>

<script setup lang="ts">
import Input from '../elements/Input.vue';
import Block from '../elements/Block.vue';

const instance = new Instance();
onUnmounted(() => instance.unmount());
</script>

<template>
  <Block :meta="Instance.meta" :instance="instance">
    <Input :instance="instance" />
  </Block>
</template>

<style scoped>
.noss-text-block {
  font-size: 1em;
  font-weight: 400;
}
</style>
