<script lang="ts">
import { BlockInstance, description } from '@/composables/blocks/instance';
import icon from '@/assets/icons/blocks/paragraph.svg?raw';

export class Instance extends BlockInstance {
  static readonly meta = description({
    name: 'Text',
    description: 'Simple plain text',
    type: 'text',
    category: 'simple_text',
    icon,
  });
}
</script>

<script setup lang="ts">
import Input from '../elements/Input.vue';
import Block from '../elements/Block.vue';

const instance = new Instance();
</script>

<template>
  <Block :options="Instance.meta" :id="instance.id">
    <Input :instance="instance" />
  </Block>
</template>

<style scoped>
.noss-text-block {
  font-size: 1em;
  font-weight: 400;
}
</style>
