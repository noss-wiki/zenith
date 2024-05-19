import type { Editor } from '..';
import type { ComponentType } from './component';
export type { ComponentType };

import { Component } from './component';
export { Component };

import { HandleComponent } from './handle';
import { ActionsComponent } from './actions';
import { SelectionComponent } from './selection';

export type ComponentClass<T extends ComponentType> = T extends 'actions'
  ? ActionsComponent
  : T extends 'handle'
  ? HandleComponent
  : T extends 'selection'
  ? SelectionComponent
  : Component;

export function createComponent<T extends ComponentType>(
  type: T,
  editor: Editor
): ComponentClass<T> {
  if (type === 'actions')
    return new ActionsComponent(type, editor) as ComponentClass<T>;
  else if (type === 'handle')
    return new HandleComponent(type, editor) as ComponentClass<T>;
  else if (type === 'selection')
    return new SelectionComponent(type, editor) as ComponentClass<T>;
  return new Component(type, editor) as ComponentClass<T>;
}
