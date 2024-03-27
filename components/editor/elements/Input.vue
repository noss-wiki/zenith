<script setup lang="ts">
defineProps<{
  index: number;
}>();
</script>

<template>
  <p
    data-content-editable-leaf="true"
    :data-input-index="$props.index"
    contenteditable="true"
  >
    <br />
  </p>
</template>

<style scoped>
/* stylelint-disable-next-line no-empty-source */
</style>
