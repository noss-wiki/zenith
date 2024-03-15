<script setup lang="ts">
withDefaults(
  defineProps<{
    symbol: string;
  }>(),
  {}
);
</script>

<template>
  <span class="material-symbols-rounded"> {{ $props.symbol }} </span>
</template>

<style></style>
