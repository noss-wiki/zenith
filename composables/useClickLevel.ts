export enum ClickLevel {
  Base,
  Menu,
  Popup,
}

type Level = ClickLevel | 0 | 1 | 2;

let clickLevel = 0;

/**
 * Wraps an event listener as a sort of middleware, that uses a `ClickLevel` to determine if it should be fired,
 * Usage:
 *
 * ```js
 * click(() => {
 *   ...
 * }).handler
 * ```
 * The `.handler` is needed so that vue doesn't wrap it in a function
 */
export function click<E>(
  cb: E extends undefined ? (...e: any[]) => void : (e: E) => void,
  level?: Level
): {
  handler: (...e: any[]) => void;
} {
  if (typeof level !== 'number') level = 0;

  return {
    handler: (e) => {
      console.log(clickLevel);
      if (level < clickLevel) return;
      return cb(e);
    },
  };
}

export function set(level: Level) {
  return (clickLevel = level);
}

export default function () {
  return {
    click,
    set,
    reset: () => set(0),
  };
}
