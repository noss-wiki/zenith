import type {
  NodeInputContent,
  BlockSelection,
  FormatType,
} from '@/composables/blocks/data';
import { formatTypes } from '@/composables/blocks/data';
import {
  getCharAtNode,
  getNodeAtChar,
  getContentLength,
} from '@/composables/utils/content';
import { Component } from './component';

export class SelectionComponent extends Component {
  type = 'selection' as const;
  show = ref<boolean>(false);

  selection: BlockSelection | null = null;
  styles = {
    accent: ref(false),
    bold: ref(false),
    italic: ref(false),
    underline: ref(false),
    'strike-through': ref(false),
  };

  mount(ref: Ref<HTMLElement | undefined>) {
    if (super.mount(ref) === false) return;

    this.on('element:selectionchange', (e) => this.#update());
  }

  turnInto(type: string = 'text') {
    if (!this.selection) return;
    const blockIndex = this.editor.blocks.indexOf(this.selection.block);
    if (blockIndex === -1) return;
    this.editor.component('handle')?.turnInto(type);
    this.selection = {
      block: this.editor.blocks[blockIndex],
      input: this.editor.blocks[blockIndex].instance.inputs[0],
      start: this.selection.start,
      end: this.selection.end,
    };
    this.selection.input.focus(this.selection);
    // TODO: Should it hide or not?
  }

  select() {
    const c = this.editor.component('handle');
    if (!c || !this.selection) return;
    c.move(this.selection.block);
    c.select();
    this.show.value = false;
  }

  format(type: FormatType) {
    this.#update();
    if (!this.selection) return;
    this.selection.input.format({
      ...this.selection,
      type,
    });
  }

  deselect() {
    this.selection = null;
    this.show.value = false;
  }

  #update() {
    const sel = window.getSelection();
    if (!sel) return;
    if (
      sel.focusOffset === sel.anchorOffset &&
      sel.anchorNode === sel.focusNode
    )
      return this.deselect();

    const block = this.editor.blocks.find((e) =>
      e.root.contains(sel.anchorNode)
    );
    const input = block?.instance.inputs.find((e) =>
      e.ref.value?.contains(sel.anchorNode)
    );
    if (!block || !input) return;

    const content = input.getContent(true);
    let start = 0,
      end = 0,
      style: FormatType[] = [];

    if (sel.anchorNode === input.ref.value)
      if (sel.anchorOffset === 0) start = 0;
      else start = getContentLength(content);
    else {
      let startNode = content.find(
        (e) => e.node === sel.anchorNode || e.node.contains(sel.anchorNode)
      );
      if (!startNode) return;
      start = getCharAtNode(content, startNode, sel.anchorOffset);
    }

    if (sel.focusNode === input.ref.value)
      if (sel.focusOffset === 0) end = 0;
      else end = getContentLength(content);
    else {
      let endNode = content.find(
        (e) => e.node === sel.focusNode || e.node.contains(sel.focusNode)
      );
      if (!endNode) return;
      end = getCharAtNode(content, endNode, sel.focusOffset);
    }

    style = getStylesAtSelection(content, start, end);

    for (const prop in this.styles)
      this.styles[prop as keyof typeof this.styles].value = style.includes(
        prop as FormatType
      );

    this.selection = { block, input, start, end };
    this.show.value = true;
    if (this.ref.value) {
      const rect = block.root.getBoundingClientRect();
      this.ref.value.style.setProperty(
        '--offset',
        `calc(${rect.top}px - 14rem)`
      );
    }
  }
}

function getStylesAtSelection(
  content: NodeInputContent[],
  start: number,
  end: number
): FormatType[] {
  const startNode = getNodeAtChar(content, start, end);
  const endNode = getNodeAtChar(content, end, start);
  if (!startNode || !endNode) return [];
  if (startNode.index === endNode.index) return startNode.style;

  let res = formatTypes.slice();
  if (startNode.index < endNode.index)
    for (let i = startNode.index; i < endNode.index + 1; i++)
      res = res.filter((e) => content[i].style.includes(e));
  else
    for (let i = endNode.index; i < startNode.index + 1; i++)
      res = res.filter((e) => content[i].style.includes(e));

  return res;
}
