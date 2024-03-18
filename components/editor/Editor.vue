<script setup lang="ts">
import WorkspaceSelect from '../WorkspaceSelect.vue';
import MaterialSymbol from '../icons/MaterialSymbol.vue';
import IconButton from '../IconButton.vue';

let root: HTMLDivElement;
</script>

<template>
  <div class="editor" ref="root">
    <div class="header"></div>
    <div class="content"></div>
  </div>
</template>

<style scoped></style>
