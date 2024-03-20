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

/**
 * A base class that will be extended by the different BlockTypes.
 * Or just define what functions the class should implement and not extend?
 */
export class Block {
  name: string = '';
  description: string = '';
  element: HTMLElement = document.createElement('div');

  constructor() {}

  fromAbstract(data: AbstractBlock) {}
  /**
   * Returns the `AbstractBlock` data to be stored
   */
  toAbstract() /* : AbstractBlock */ {}
}

export function createBlockRoot(type: string) {
  const div = document.createElement('div');
  div.className = `noss-selectable noss-${type}-block`;
}
