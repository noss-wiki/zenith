import type { Block, InputRegister } from '@/composables/blocks';
import type { NodeInputContent } from '@/composables/blocks/data';
import { Component } from './component';

interface BlockSelection {
  block: Block;
  input: InputRegister;
  /**
   * The number of the char in the block input content at which the selection anchor is positioned,
   * which means this can be more than the end.
   */
  start: number;
  /**
   * The number of the char in the block input content at which the selection focus is positioned,
   * which means this can be less than the start.
   */
  end: number;
}

export class SelectionComponent extends Component {
  type = 'selection' as const;
  show = ref<boolean>(true);

  selection: BlockSelection | null = null;

  mount(ref: Ref<HTMLElement | undefined>) {
    if (super.mount(ref) === false) return;

    this.on('element:mouseup', (e) => this.#onMouseup(), document.body);
  }

  deselect() {
    this.selection = null;
  }

  #onMouseup() {
    const sel = window.getSelection();
    if (!sel || sel.focusOffset === sel.anchorOffset) return;

    const block = this.editor.blocks.find((e) =>
      e.root.contains(sel.anchorNode)
    );
    const input = block?.instance.inputs.find((e) =>
      e.ref.value?.contains(sel.anchorNode)
    );
    if (!block || !input) return;

    const content = input.getContent(true);
    const startNode = content.find((e) => e.node === sel.anchorNode);
    const endNode = content.find((e) => e.node === sel.focusNode);
    if (!startNode || !endNode) return;

    const start = getCharToNode(content, startNode, sel.anchorOffset);
    const end = getCharToNode(content, endNode, sel.focusOffset);

    this.selection = { block, input, start, end };
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
