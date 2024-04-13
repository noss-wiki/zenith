<script setup lang="ts">
import type { VNodeRef, TransitionProps } from 'vue';

defineProps<{
  transition?: TransitionProps;
}>();

const show = defineModel<boolean>();
</script>

<template>
  <div class="popup" v-show="show">
    <slot />
    <div
      class="popup-area"
      :style="{ 'pointer-events': show ? 'all' : 'none' }"
      @click="() => (show = false)"
    ></div>
  </div>
</template>

<style scoped>
.popup {
  z-index: 999;
  isolation: isolate;
}

.popup-area {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
