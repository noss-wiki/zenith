import type { Node } from './node';
import type { PositionLike, IndexPosData, LocateStep } from './position';
import { Position, locateNode, calculateSteps } from './position';
import { Fragment } from './fragment';

// Editor representation of the document Range
export class Slice {
  /**
   * @param content The content of this slice
   * @param openStart The offset in the content at the start where the slice starts
   * @param openEnd The offset in the content at the end where the slice ends
   * @param document The document the content originated from, leave empty if this slice is not part of a document
   */
  constructor(
    readonly content: Fragment,
    readonly openStart: number,
    readonly openEnd: number,
    readonly document?: Node
  ) {}

  // static methods

  /**
   * An empty slice
   */
  static get empty(): Slice {
    return new Slice(new Fragment([]), 0, 0);
  }
}

// TODO: Returns something else instead of throwing, but include the reason why it failed

/**
 * Tries to find the deepest possible common parent between two positions, throws if it can't for whatever reason.
 */
export function findCommonParent(from: Position, to: Position) {
  if (from.document !== to.document)
    throw new Error('Linked positions are in two different documents');

  if (!calculateSteps(from) || !calculateSteps(to))
    throw new Error('Failed to calculate steps on Position');

  // can probably skip depth 0, as it is always the document node
  const depth = findDeepestCommonParent(from, to, 0);
  if (!depth) throw new Error('Failed to find a common parent');

  console.log(from.steps, to.steps);

  return {
    ...depth,
    document: from.document,
  } as IndexPosData;
}

function findDeepestCommonParent(
  from: Position,
  to: Position,
  depth: number
): LocateStep | undefined {
  if (!from.steps!.steps[depth] || !to.steps!.steps[depth]) return undefined;
  else if (from.steps!.steps[depth].node === to.steps!.steps[depth].node) {
    const res = findDeepestCommonParent(from, to, depth + 1);
    if (res) return res;
    else return from.steps!.steps[depth];
  }

  return undefined;
}
