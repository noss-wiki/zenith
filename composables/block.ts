/**
 * The type that gets stored, this includes all the data for the Block class to load everything properly
 */
export interface AbstractBlock {
  type: string; // this should be the name of a `BlockType`, prob add list type for this?
  data: any; // this is what the extended block class can read to determine what it shoud render, can be string, object, etc.
}

export interface BlockType {
  name: string;
  description: string;
  // icon: ...; the icon that gets showed in the commands list
  // also add preview prop for a preview image later?
}

interface HandleData {
  type: 'carryContentBackward';
  data: string;
}

/**
 * A base class that will be extended by the different BlockTypes.
 * Or just define what functions the class should implement and not extend?
 */
export class Block {
  name: string = 'Base';
  format: string = 'base';
  description: string = '';
  root: HTMLDivElement = this.createRoot();

  constructor() {}

  unmount() {}

  render(): HTMLElement {
    return this.root;
  }

  focus(char?: number) {
    this.root.focus();
  }

  /**
   * The handler for when input gets added
   */
  input() {}

  createRoot() {
    const div = document.createElement('div');
    div.className = `noss-selectable noss-${this.format}-block`;
    return div;
  }

  /**
   * Handle if content should be inserted when carrying content backwards, return false to not allow.
   * If you return true, you hould insert it yourself as that will not be handled
   * @param data The string to insert
   */
  receiveContentBackwards(data: string): boolean {
    return false;
  }

  /**
   * Handle if content should be carried backwards, return false to not allow.
   */
  carryContentBackwards(): boolean {
    return false;
  }
}

/**
 * Extend this class for a simple text input, e.g. heading, text, quote, etc.
 */
export class SimpleBlock extends Block {
  text?: HTMLElement;
  textNode?: Text;

  #default?: string;

  constructor(content?: string) {
    super();
    this.#default = content;
  }

  focus(char?: number) {
    if (!this.text) return;
    if (typeof char !== 'number' || char > this.content.length)
      char = this.content.length;
    else if (char < 0) char = this.content.length + char;
    if (char < 0) char = 0;
    console.log(char);

    if (!this.textNode) return;

    const range = document.createRange();
    const sel = window.getSelection();
    if (!sel) return;

    range.setStart(this.textNode, char);
    range.collapse(true);

    sel.removeAllRanges();
    setTimeout(() => {
      sel.addRange(range);
    }, 1);
  }

  render() {
    this.root = this.createRoot();
    this.text = document.createElement('p');
    this.textNode = document.createTextNode('');
    if (this.#default) this.textNode.data = this.#default;

    this.text.appendChild(this.textNode);
    this.text.appendChild(document.createElement('br'));
    this.text.setAttribute('contenteditable', 'true');
    this.text.setAttribute('data-content-editable-leaf', 'true');
    this.root.appendChild(this.text);
    return this.root;
  }

  get content(): string {
    return this.textNode?.textContent ?? '';
  }

  set content(data: string) {
    if (this.textNode && this.text && !this.text.contains(this.textNode)) {
      this.text.innerHTML = '';
      this.text.appendChild(this.textNode);
      this.text.appendChild(document.createElement('br'));
    }
    if (this.textNode) this.textNode.data = data;
    else if (this.text) {
      this.text.innerHTML = data;
      this.textNode =
        this.text.childNodes[0].nodeType === 3
          ? (this.text.childNodes[0] as Text)
          : undefined;
    }
  }

  receiveContentBackwards(data: string) {
    this.content += data;
    return true;
  }

  carryContentBackwards() {
    return true;
  }
}
