import type { Block, InputRegister } from '@/composables/blocks';
import type {
  NodeInputContent,
  InputData,
  BlockSelection,
  FormatType,
} from '@/composables/blocks/data';
import { formatTypes } from '@/composables/blocks/data';
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
    //this.on('element:mouseup', (e) => this.#onMouseup());
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
    let start, end, style;
    if (sel.focusNode !== input.ref.value) {
      let startNode = content.find(
        (e) =>
          e.node === sel.anchorNode ||
          (sel.anchorNode !== null &&
            Array.from(e.node.childNodes).includes(sel.anchorNode as ChildNode))
      );
      let endNode = content.find(
        (e) =>
          e.node === sel.focusNode ||
          (sel.focusNode !== null &&
            Array.from(e.node.childNodes).includes(sel.focusNode as ChildNode))
      );
      if (!startNode || !endNode) return;

      start = getCharToNode(content, startNode, sel.anchorOffset);
      end = getCharToNode(content, endNode, sel.focusOffset);

      let ei = content.indexOf(endNode);
      if (
        endNode.type === 'text' &&
        sel.focusOffset === endNode.content.length &&
        content[ei + 1] !== undefined
      )
        endNode = content[ei + 1];

      style = getStylesAtSelection(content, startNode, endNode);
    } else {
      start = 0;
      end = getContentLength(content);
      style = getStylesAtSelection(
        content,
        content[0],
        content[content.length - 1]
      );
    }

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

function getCharToNode(
  content: NodeInputContent[],
  node: NodeInputContent,
  char: number
): number {
  const index = content.indexOf(node);
  if (index === -1) return -1;
  else if (index === 0) return char;

  let res = char;

  for (let i = 0; i < index; i++) {
    if (content[i].type !== 'text') res += 1;
    else res += content[i].content.length;
  }

  return res;
}

function getStylesAtSelection(
  content: NodeInputContent[],
  start: NodeInputContent,
  end: NodeInputContent
) {
  const startIndex = content.indexOf(start);
  const endIndex = content.indexOf(end);
  if (startIndex < 0 || endIndex < 0) return [];
  if (startIndex === endIndex) return start.style;

  let res = formatTypes.slice();
  if (startIndex < endIndex)
    for (let i = startIndex; i < endIndex + 1; i++)
      res = res.filter((e) => content[i].style.includes(e));
  else
    for (let i = endIndex; i < startIndex + 1; i++)
      res = res.filter((e) => content[i].style.includes(e));

  return res;
}

function getContentLength(content: InputData): number {
  let res = 0;
  for (const i of content) res += i.type === 'text' ? i.content.length : 1;
  return res;
}
