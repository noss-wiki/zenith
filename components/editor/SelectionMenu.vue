<script setup lang="ts">
import type { Editor } from '@/composables/editor';

const { instance } = defineProps<{
  instance: Editor;
}>();

let selectionMenu = ref<HTMLElement>();
const component = instance.attach('selection');
onMounted(() => component.mount(selectionMenu));
onUnmounted(() => instance.detach(component));

const show = ref(false);
</script>

<template>
  <Transition name="fade" mode="in-out">
    <FunctionalPopup
      v-model="show"
      class="selection-menu"
      noss-editor-selection-menu
      ref="selectionMenu"
      :before-close="
        () => {
          component.deselect();
        }
      "
    >
      <Button surface transparent> Link </Button>
      <Divider vertical />
      <Button surface transparent> Text </Button>
    </FunctionalPopup>
  </Transition>
</template>

<style scoped>
.selection-menu {
  display: flex;
  height: 2.5rem;
  background: var(--color-raised-surface);
  border-radius: var(--radius-default);

  & :first-child {
    border-radius: var(--radius-default) 0 0 var(--radius-default);
  }

  & :last-child {
    border-radius: 0 var(--radius-default) var(--radius-default) 0;
  }
}
</style>
