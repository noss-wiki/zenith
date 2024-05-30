/*
# Content expressions

The structure of a single expression is as following
`{group}{modifier}`

Where
- `group`, is one or more types e.g. `paragraph`, `(paragraph | code)`
- `modifier`, is one of the following `*`, `?`, `+`, `{1,2}` (this is like regex capturing group, so second number can be omitted, to allow more than)
  - ` `, 1 times
  - `*`, 0 or more
  - `?`, 0 or 1
  - `+`, 1 or more
  - `{1,2}`, regex-like range expression

Multiple of these structures can be repeated, if they have a non-infinite repeat pattern.

https://prosemirror.net/docs/guide/#schema.content_expressions
*/

type ExpressionGroup = string;
type ExpressionModifier = '*' | '?' | '+' | `{${number},${number | ''}}` | '';

interface ParsedExpression {
  expression: string;
  selectors: SingleExpressionMatch[];
}

/**
 * The structure of a single expression is e.g. `paragraph+`, but not `heading paragraph+`
 */
interface SingleExpressionMatch {
  /**
   * The raw selector
   */
  selector: string;
  /**
   * The raw modifier
   */
  modifier?: string;
  /**
   * The range on which the selector applies,
   * if the second value is `-1` it should match infinte times (`*`, `+`, `{1,}`)
   */
  range: [number, number];
}

const expressionRegex =
  /(?<selector>[a-zA-Z]+|\([a-zA-Z |]+\))(?<modifier>\*|\+|\?|(\{[0-9]+,[0-9]*\}))?/g;
const rangeRegex = /{(?<start>[0-9]*),(?<end>[0-9]*) *}/;

export class ContentExpression {
  expression: string;

  constructor(expression: string) {
    this.expression = expression;
  }

  parse(): ParsedExpression {
    const matches = matchAll(this.expression, expressionRegex);
    if (matches === null)
      return {
        expression: this.expression,
        selectors: [],
      };
    const res: SingleExpressionMatch[] = [];

    for (const match of matches) {
      if (!match.groups) continue;
      let { selector, modifier } = match.groups as {
        selector: string;
        modifier: ExpressionModifier;
      };

      let range: [number, number] = [1, 1];
      if (modifier === '?') range = [0, 1];
      else if (modifier === '+') range = [1, -1];
      else if (modifier === '*') range = [0, -1];
      else if (modifier && modifier.startsWith('{')) {
        let rangeMatch = rangeRegex.exec(modifier);
        if (!rangeMatch || !rangeMatch.groups) continue;
        let { start, end } = rangeMatch.groups;
        if (!end) end = '-1';
        range = [parseInt(start), parseInt(end)];
      }

      res.push({ selector, modifier, range });
    }

    return {
      expression: this.expression,
      selectors: res,
    };
  }

  // static methods
  static validate(expression: string) {
    // TODO: proper validation
    const match = expression.match(expressionRegex);
    return match !== null;
  }

  static from(expression: string) {
    return new ContentExpression(expression);
  }
}

/* new ContentExpression('(paragraph | blockquote)+').parse();
new ContentExpression('heading paragraph+').parse();
new ContentExpression('text{2,231}').parse();
new ContentExpression('text').parse();
new ContentExpression('text*').parse();
new ContentExpression('text?').parse(); */

function matchAll(expression: string, regex: RegExp) {
  let res = [],
    m;

  while ((m = regex.exec(expression)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex++;
    res.push(m);
  }

  if (res.length === 0) return null;
  return res;
}
