<script lang="ts">
import { BlockInstance, description } from '@/composables/blocks/instance';
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
