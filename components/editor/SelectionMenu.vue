<script setup lang="ts">
import type { Editor } from '@/composables/editor';

import BoldIcon from '@/assets/icons/format/bold.svg';
import ClearIcon from '@/assets/icons/format/clear.svg';
import CodeIcon from '@/assets/icons/format/code.svg';
import ColorIcon from '@/assets/icons/format/color.svg';
import ItalicIcon from '@/assets/icons/format/italic.svg';
import MentionIcon from '@/assets/icons/format/mention.svg';
import UnderlineIcon from '@/assets/icons/format/underline.svg';
import StrikeThroughIcon from '@/assets/icons/format/strike-through.svg';

const { instance } = defineProps<{
  instance: Editor;
}>();

let selectionMenu = ref<HTMLElement>();
const component = instance.attach('selection');
onMounted(() => component.mount(selectionMenu));
onUnmounted(() => instance.detach(component));
</script>

<template>
  <Transition name="fade" mode="in-out">
    <div
      v-show="component.show.value"
      class="selection-menu"
      noss-editor-selection-menu
      ref="selectionMenu"
      :before-close="
        () => {
          component.deselect();
        }
      "
    >
      <Button surface transparent square> Link </Button>
      <Divider vertical />
      <Button surface transparent square> Text </Button>
      <Divider vertical />
      <Button surface transparent icon-only square>
        <ColorIcon />
        <!-- add dropdown to select color -->
      </Button>
      <Divider vertical />
      <Button
        surface
        transparent
        icon-only
        square
        tooltip
        @click="() => component.format('bold')"
      >
        <BoldIcon />
        <Tooltip>
          Bold
          <span class="shortcut">Ctrl + B</span>
        </Tooltip>
      </Button>
      <Button
        surface
        transparent
        icon-only
        square
        tooltip
        @click="() => component.format('italic')"
      >
        <ItalicIcon />
        <Tooltip>
          Italicize
          <span class="shortcut">Ctrl + I</span>
        </Tooltip>
      </Button>
      <Button
        surface
        transparent
        icon-only
        square
        tooltip
        @click="() => component.format('underline')"
      >
        <UnderlineIcon />
        <Tooltip>
          Underline
          <span class="shortcut">Ctrl + U</span>
        </Tooltip>
      </Button>
      <Button
        surface
        transparent
        icon-only
        square
        tooltip
        @click="() => component.format('strike-through')"
      >
        <StrikeThroughIcon />
        <Tooltip>
          Strike-through
          <span class="shortcut">Ctrl + Shift + X or Alt + Shift + 5</span>
        </Tooltip>
      </Button>
      <Divider vertical />
      <Button surface transparent icon-only square tooltip>
        <MentionIcon />
        <Tooltip>
          Mention
          <span class="shortcut">@</span>
        </Tooltip>
      </Button>
      <Button surface transparent icon-only square tooltip>
        <CodeIcon />
        <Tooltip>
          Mark as code
          <span class="shortcut">Ctrl + E</span>
        </Tooltip>
      </Button>
    </div>
  </Transition>
</template>

<style scoped>
.selection-menu {
  --offset: 0px;

  position: absolute;
  top: calc(11rem + var(--offset));
  left: 0;
  display: flex;
  height: 2.5rem;
  background: var(--color-raised-surface);
  border-radius: var(--radius-default);

  & > :first-child {
    border-radius: var(--radius-default) 0 0 var(--radius-default);
  }

  & > :last-child {
    border-radius: 0 var(--radius-default) var(--radius-default) 0;
  }
}

.tooltip {
  white-space: nowrap;
}

span.shortcut {
  white-space: nowrap;
  color: var(--color-inactive);
}
</style>
