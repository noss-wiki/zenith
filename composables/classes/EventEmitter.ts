export interface EventData {
  readonly defaultPrevented: boolean;
  preventDefault(): void;
  stopImmediatePropagation(): void;
}

export class EventEmitter<
  EventMap extends {
    [x: string]: any;
  }
> {
  protected listeners: {
    type: keyof EventMap;
    callback: (e: any) => void | boolean;
  }[] = [];

  protected allowPreventingDefault: boolean;

  constructor(allowPreventingDefault?: boolean) {
    this.allowPreventingDefault = allowPreventingDefault ?? true;
  }

  emit<T extends keyof EventMap>(type: T, data: EventMap[T]) {
    let stoppedImmediatePropagation = false;
    let eventData: EventData = {
      defaultPrevented: false,
      preventDefault: () => {
        if (this.allowPreventingDefault === true) {
          //@ts-ignore
          eventData.defaultPrevented = true;
        }
      },
      stopImmediatePropagation: () => (stoppedImmediatePropagation = true),
      ...data,
    };
    for (const l of this.listeners) {
      if (l.type !== type) continue;
      const res = l.callback(eventData);
      //@ts-ignore
      if (res === true) eventData.defaultPrevented = true;
      if (stoppedImmediatePropagation) break;
    }
    return eventData.defaultPrevented;
  }

  on<T extends keyof EventMap>(
    type: T,
    callback: (e: EventData & EventMap[T]) => void | boolean
  ) {
    this.listeners.push({ type, callback });
  }
}
