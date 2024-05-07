<script setup lang="ts">
const show = defineModel<boolean>({ required: true });
const props = defineProps<{
  beforeClose?: () => void;
}>();
let root: HTMLElement;

watchEffect(() => {
  if (!document) return;

  if (show.value === true)
    document.body.style.setProperty('pointer-events', 'none');
  else document.body.style.removeProperty('pointer-events');
});

const click = (e: MouseEvent) => {
  const t = e.target as HTMLElement;
  if (show.value === true && t.tagName === 'HTML') {
    show.value = false;
    props.beforeClose?.();
  }
};

onMounted(() => document.addEventListener('click', click));
onUnmounted(() => document.removeEventListener('click', click));
</script>

<template>
  <div class="popup" v-show="show" ref="root">
    <slot />
  </div>
</template>

<style scoped>
.popup {
  pointer-events: all;
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
