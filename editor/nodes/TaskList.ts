import { Node } from '../lib/model/node';
import icon from '@/assets/icons/blocks/task_list.svg?raw';
import { NodeType } from '../lib/model/nodeType';

export default class TaskList extends Node {
  static type = NodeType.from({
    name: 'task_list',
    meta: {
      name: 'Task list',
      description: 'Create a easy to-do list',
      icon,
    },
    schema: {
      content: 'inline*',
      group: 'block',
    },
  });

  checked = false;

  /* render(): ElementDefinition {
    return [
      'div',
      { class: 'task_list_block' },
      ['input', { type: 'checkbox' }],
      ['p', {}, Outlet],
    ];
  } */
}
