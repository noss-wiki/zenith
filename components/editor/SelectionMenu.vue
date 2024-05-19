<script setup lang="ts">
import type { Editor } from '@/editor';

import BoldIcon from '@/assets/icons/format/bold.svg';
import ClearIcon from '@/assets/icons/format/clear.svg';
import CodeIcon from '@/assets/icons/format/code.svg';
import AccentIcon from '@/assets/icons/format/color.svg';
import ItalicIcon from '@/assets/icons/format/italic.svg';
import LinkIcon from '@/assets/icons/format/link.svg';
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

const { blocks, sorted, categories } = useBlocks();
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
      <Button surface transparent small dropdown>
        Text
        <Dropdown position="bottom">
          <template v-for="(category, index) in categories">
            <Divider v-if="sorted[category].length > 0 && index > 0" menu />
            <Button
              v-for="{ name, icon, type } in sorted[category]"
              surface
              transparent
              @click="component.turnInto(type)"
            >
              <div class="icon" v-html="icon" style="height: 1.5rem"></div>
              {{ name }}
            </Button>
          </template>
        </Dropdown>
      </Button>
      <Button surface transparent small tooltip>
        <MaterialSymbol symbol="comment" style="font-size: 1.25rem" />
        Comment
        <Tooltip> Comment on selected text </Tooltip>
      </Button>
      <Divider vertical />
      <Button
        surface
        transparent
        icon-hover
        small
        tooltip
        @click="() => component.format('accent')"
      >
        <AccentIcon
          class="style-icon"
          :data-active="component.styles.accent.value"
        />
        <Tooltip>
          Accent
          <span class="shortcut">Ctrl + Shift + H</span>
        </Tooltip>
      </Button>
      <Button
        surface
        transparent
        icon-hover
        small
        tooltip
        @click="() => component.format('bold')"
      >
        <BoldIcon
          class="style-icon"
          :data-active="component.styles.bold.value"
        />
        <Tooltip>
          Bold
          <span class="shortcut">Ctrl + B</span>
        </Tooltip>
      </Button>
      <Button
        surface
        transparent
        icon-hover
        small
        tooltip
        @click="() => component.format('italic')"
      >
        <ItalicIcon
          class="style-icon"
          :data-active="component.styles.italic.value"
        />
        <Tooltip>
          Italicize
          <span class="shortcut">Ctrl + I</span>
        </Tooltip>
      </Button>
      <Button
        surface
        transparent
        icon-hover
        small
        tooltip
        @click="() => component.format('underline')"
      >
        <UnderlineIcon
          class="style-icon"
          :data-active="component.styles.underline.value"
        />
        <Tooltip>
          Underline
          <span class="shortcut">Ctrl + U</span>
        </Tooltip>
      </Button>
      <Button
        surface
        transparent
        icon-hover
        small
        tooltip
        @click="() => component.format('strike-through')"
      >
        <StrikeThroughIcon
          class="style-icon"
          :data-active="component.styles['strike-through'].value"
        />
        <Tooltip>
          Strike-through
          <span class="shortcut">Ctrl + Shift + X or Alt + Shift + 5</span>
        </Tooltip>
      </Button>
      <Divider vertical />
      <Button surface transparent icon-hover small tooltip>
        <MentionIcon />
        <Tooltip>
          Mention
          <span class="shortcut">@</span>
        </Tooltip>
      </Button>
      <Button surface transparent icon-hover small tooltip>
        <CodeIcon />
        <Tooltip>
          Mark as code
          <span class="shortcut">Ctrl + E</span>
        </Tooltip>
      </Button>
      <Button surface transparent icon-hover small tooltip>
        <LinkIcon />
        <Tooltip>
          Add link
          <span class="shortcut">Ctrl + K</span>
        </Tooltip>
      </Button>
      <Divider vertical />
      <Button surface transparent icon-hover small tooltip>
        <ClearIcon />
        <Tooltip>
          Clear formatting
          <span class="shortcut">Ctrl + /</span>
        </Tooltip>
      </Button>
      <Divider vertical />
      <Button
        surface
        transparent
        icon-hover
        small
        tooltip
        @click="component.select()"
      >
        <MaterialSymbol symbol="more_horiz" />
        <Tooltip> Select entire block </Tooltip>
      </Button>
    </div>
  </Transition>
</template>

<style scoped>
.selection-menu {
  --offset: 14rem;

  position: absolute;
  top: calc(var(--offset) - 3rem);
  left: 0;
  display: flex;
  height: 2.5rem;
  padding: 0.25rem;
  background: var(--color-raised-surface);
  border-radius: var(--radius-default);

  & > .divider {
    margin: 0.25rem;
    height: calc(100% - 0.5rem);
  }
}

.style-icon {
  transition: color 0.3s ease;

  &[data-active='true'] {
    color: var(--color-primary);
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
