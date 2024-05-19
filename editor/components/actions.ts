import { Component } from './component';

export class ActionsComponent extends Component {
  type = 'actions' as const;
  show = ref<boolean>(false);

  get handle() {
    return this.editor.component('handle');
  }

  hide() {
    this.show.value = false;
  }
}
