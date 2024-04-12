<script setup lang="ts">
import type { Editor } from '@/composables/editor';

/* const { editor } = defineProps<{
  editor: Editor;
}>(); */

const { click } = useClickLevel();
const { blocks } = useBlocks();
</script>

<template>
  <div class="actions-menu">
    <Button surface transparent>
      <MaterialSymbol symbol="chat" />
      Comment
    </Button>
    <Divider menu />
    <Button surface transparent>
      <MaterialSymbol symbol="delete" />
      Delete
    </Button>
    <Button surface transparent>
      <MaterialSymbol symbol="content_copy" />
      Duplicate
    </Button>
    <Button surface transparent dropdown>
      <MaterialSymbol symbol="swap_horiz" />
      Turn into
      <Dropdown>
        <Button v-for="block in blocks" surface transparent>
          {{ block.name }}
        </Button>
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
  </div>
</template>

<style scoped>
.actions-menu {
  background: var(--color-raised-surface);
  width: 20rem;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: var(--radius-default);

  & .last-edited {
    color: var(--color-inactive);
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
}
</style>
