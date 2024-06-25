import type {
  NodeMetaData,
  NodeSchema,
  ElementDefinition,
} from '../lib/model/node';
import { Node, Outlet } from '../lib/model/node';
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

  static type = 'tast_list';
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
