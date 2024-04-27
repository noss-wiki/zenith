<script lang="ts">
import { description, BlockInstance } from '@/composables/blocks/instance';
import { SingleInputBlockInstance } from '@/composables/blocks/singleInput';
import icon from '@/assets/icons/blocks/header.svg?raw';

export class Instance extends BlockInstance {
  static readonly meta = description({
    name: 'Heading 1',
    description: 'The largest heading',
    type: 'header',
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
.noss-header-block {
  font-size: 1.875em;
  font-weight: 600;
}
</style>
