import type { NodeMetaData, NodeSchema, ElementDefinition } from './Node';
import { Node, Outlet } from './Node';
import icon from '@/assets/icons/blocks/task_list.svg?raw';

export default class TaskList extends Node {
  static meta: NodeMetaData = {
    name: 'Task list',
    description: 'Create a easy to-do list',
    icon,
  };

  static schema: NodeSchema = {
    content: 'inline*',
    group: 'block',
  };

  type = 'tast_list';
  isInline = true;

  checked = false;

  render(): ElementDefinition {
    return [
      'div',
      { class: 'task_list_block' },
      ['input', { type: 'checkbox' }],
      ['p', {}, Outlet],
    ];
  }
}
