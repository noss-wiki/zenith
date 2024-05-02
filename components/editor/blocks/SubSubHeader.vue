<script lang="ts">
import { description, BlockInstance } from '@/composables/blocks/instance';
import { SingleInputBlockInstance } from '@/composables/blocks/singleInput';
import icon from '@/assets/icons/blocks/sub_sub_header.svg?raw';

export class Instance extends BlockInstance {
  static readonly meta = description({
    name: 'Heading 3',
    description: 'The smallest heading',
    type: 'sub_sub_header',
    category: 'simple_text',
    inputs: 1,
    centerHandle: true,
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
/* stylelint-disable-next-line selector-class-pattern */
.noss-sub_sub_header-block {
  font-size: 1.2em;
  font-weight: 600;
}
</style>
