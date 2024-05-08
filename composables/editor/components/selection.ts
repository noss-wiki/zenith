import type { Block, InputRegister } from '@/composables/blocks';
import type {
  NodeInputContent,
  InputData,
  BlockSelection,
  FormatType,
} from '@/composables/blocks/data';
import { Component } from './component';

export class SelectionComponent extends Component {
  type = 'selection' as const;
  show = ref<boolean>(false);

  selection: BlockSelection | null = null;

  mount(ref: Ref<HTMLElement | undefined>) {
    if (super.mount(ref) === false) return;

    this.on('element:selectionchange', (e) => this.#update());
    //this.on('element:mouseup', (e) => this.#onMouseup());
  }

  format(type: FormatType) {
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
    if (sel.focusOffset === sel.anchorOffset) return this.deselect();

    const block = this.editor.blocks.find((e) =>
      e.root.contains(sel.anchorNode)
    );
    const input = block?.instance.inputs.find((e) =>
      e.ref.value?.contains(sel.anchorNode)
    );
    if (!block || !input) return;

    const content = input.getContent(true);
    let start, end;
    if (sel.focusNode !== input.ref.value) {
      const startNode = content.find((e) => e.node === sel.anchorNode);
      const endNode = content.find((e) => e.node === sel.focusNode);
      if (!startNode || !endNode) return;
      start = getCharToNode(content, startNode, sel.anchorOffset);
      end = getCharToNode(content, endNode, sel.focusOffset);
    } else {
      start = 0;
      end = getContentLength(content);
    }

    this.selection = { block, input, start, end };
    this.show.value = true;
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

function getContentLength(content: InputData): number {
  let res = 0;
  for (const i of content) res += i.type === 'text' ? i.content.length : 1;
  return res;
}
