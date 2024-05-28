/*
# Content expressions

The structure of a single expression is as following
`{group}{modifier}`

Where
- `group`, is one or more types e.g. `paragraph`, `(paragraph | code)`
- `modifier`, is one of the following `*`, `?`, `+`, `{1,2}` (this is like regex capturing group, so second number can be omitted, to allow more than)
  - ` `, 1 times
  - `*`, 0 or more
  - `?`, 0 of 1
  - `+`, 1 or more
  - `{1,2}`, regex-like range expression

Multiple of these structures can be repeated, if they have a non-infinite repeat pattern.

https://prosemirror.net/docs/guide/#schema.content_expressions
*/

type ExpressionGroup = string;
type ExpressionModifier = '*' | '?' | '+' | `{${number},${number | ''}}` | '';

/**
 * The structure of a single expression is e.g. `paragraph+`, but not `heading paragraph+`
 */
interface SingleExpressionMatch {
  modifier: string;

  rangeStart: number;
  /**
   * The maximum of the range, is `-1` if it should match infinte times (`*`, `+`, `{1,}`)
   */
  rangeEnd: number;
}

const expressionRegex =
  /([a-zA-Z]+|\([a-zA-Z |]+\))(\*|\+|\?|(\{[0-9]+,[0-9]*\}))?/g;

export class ContentExpression {
  expression: string;

  constructor(expression: string) {
    this.expression = expression;
  }

  parse() {
    const matches = matchAll(this.expression, expressionRegex);
  }

  // static methods
  static validate(expression: string) {
    const match = expression.match(expressionRegex);
    console.log(matchAll(expression, expressionRegex));
    return match !== null;
  }

  static from(expression: string) {
    return new ContentExpression(expression);
  }
}

ContentExpression.validate('heading paragraph+');
ContentExpression.validate('(paragraph | blockquote)+');
ContentExpression.validate('block?');
ContentExpression.validate('text{2,231}');
ContentExpression.validate('text');

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
