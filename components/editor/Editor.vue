<script setup lang="ts">
import '@/editor/nodes/nodes.css';
import { EditorView } from '@/editor/lib/view';
import { EditorState } from '@/editor/lib/state';
import DocumentNode from '@/editor/nodes/Document';
import Paragraph from '@/editor/nodes/Paragraph';
import { Position } from '@/editor/lib/model/position';
import { Transaction } from '@/editor/lib/state/transaction';

let root: HTMLDivElement;
let contentRoot: HTMLDivElement;

const docNode = new DocumentNode();
docNode.content.insert(new Paragraph());
const p = new Paragraph();
docNode.content.insert(p);
p.content.insert(new Paragraph());
/* docNode.check(); */

const state = new EditorState(docNode);
const view = new EditorView(state);

const tr = new Transaction(state);
tr.insert(Position.before(p), p);

onMounted(() => {
  view.mount(contentRoot);
  view.render();
});
onUnmounted(() => view.unmount());
</script>

<template>
  <div class="editor" ref="root" noss-editor-root>
    <div class="inner">
      <div class="header"></div>
      <div class="content" ref="contentRoot"></div>
      <!-- <div class="components">
        <EditorHandle :instance="editor" />
        <EditorActions :instance="editor" />
        <EditorSelectionMenu :instance="editor" />
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.editor {
  --block-hover-padding: 6rem;

  padding-top: 14rem;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  /* breaks overflow-x which cuts of the actions menu */

  /* overflow-y: auto; */
}

.inner {
  isolation: isolate;
  width: 60rem;
  height: 100%;
  position: relative;
}

.content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-x: hidden;
}
</style>
