export class Logger {
  #name: string | undefined;

  constructor(name?: string) {
    this.#name = name;
  }

  init(name: string) {
    this.#name = name;
  }

  info(...args: any[]) {
    console.log(...fargs(this.#name, args));
  }

  /**
   * @param msg
   * @param stack Will display this at the end of the warning, to help indentify function call. Format something like: `Logger.error`
   */
  error(msg: string, stack?: string) {
    if (stack) console.error(`${fstring(this.#name, msg)}\n  at ${stack}`);
    else console.error(fstring(this.#name, msg));
  }
}

function fstring(name: string | undefined, content: string) {
  if (!name) return `${content}`;
  else return `[${name}] ${content}`;
}

function fargs(name: string | undefined, args: any[]) {
  if (!name) return args;
  else return [`[${name}]`, ...args];
}

export class LoggerClass {
  logger = new Logger();
}
