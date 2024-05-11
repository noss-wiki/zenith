<script setup lang="ts">
import type { Editor } from '@/composables/editor';

const { instance } = defineProps<{
  instance: Editor;
}>();

let actionsRef = ref<HTMLElement>();
const component = instance.attach('actions');

onMounted(() => component.mount(actionsRef));
onUnmounted(() => instance.detach(component));

const show = defineModel<boolean>({ default: false });
watchEffect(() => (show.value = component.show.value));

const { blocks, sorted, categories } = useBlocks();
</script>

<template>
  <Transition name="fade" mode="in-out">
    <FunctionalPopup
      v-model="component.show.value"
      class="actions-menu"
      noss-editor-handle-menu
      ref="actionsRef"
    >
      <Button surface transparent>
        <MaterialSymbol symbol="chat" />
        Comment
      </Button>
      <Divider menu />
      <Button
        surface
        transparent
        @click="
          () => {
            component.handle?.remove();
            component.hide();
          }
        "
      >
        <MaterialSymbol symbol="delete" />
        Delete
      </Button>
      <Button
        surface
        transparent
        @click="
          () => {
            component.handle?.duplicate();
            component.hide();
          }
        "
      >
        <MaterialSymbol symbol="content_copy" />
        Duplicate
      </Button>
      <Button surface transparent dropdown>
        <MaterialSymbol symbol="swap_horiz" />
        Turn into
        <Dropdown>
          <template v-for="(category, index) in categories">
            <Divider v-if="sorted[category].length > 0 && index > 0" menu />
            <Button
              v-for="{ name, icon, type } in sorted[category]"
              surface
              transparent
              @click="
                () => {
                  component.handle?.turnInto(type);
                  component.hide();
                }
              "
            >
              <div class="icon" v-html="icon" style="height: 1.5rem"></div>
              {{ name }}
            </Button>
          </template>
        </Dropdown>
      </Button>
      <Divider menu />
      <Button surface transparent dropdown>
        <MaterialSymbol symbol="border_color" />
        Color
      </Button>
      <Divider menu />
      <div class="last-edited">
        <p>Last edited by Robin de Vos</p>
        <p>8 april 20224, 17:29</p>
      </div>
    </FunctionalPopup>
  </Transition>
</template>

<style scoped>
.actions-menu {
  --block-top: 0px;
  --block-left: 0px;

  position: absolute;
  top: calc(var(--block-top));
  left: -2rem;
  z-index: 100;
  transform: translate(-100%, -50%);
  background: var(--color-raised-surface);
  width: 20rem;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: var(--radius-default);
  opacity: 1;
  transition: opacity 0.3s ease;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }

  & .last-edited {
    color: var(--color-inactive);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
.icon,
.icon * {
  color: var(--color, var(--icon-inactive));
  fill: var(--color, var(--icon-inactive));
  transition: fill 0.3s ease;
}
</style>
