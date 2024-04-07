export interface HandleActions {
  select(): void;
  addBelow(): void;
  addAbove(): void;
}

export function useHandleActions(): HandleActions {
  return {
    select() {},
    addBelow() {},
    addAbove() {},
  };
}
