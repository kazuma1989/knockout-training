import ko from 'knockout';
import $ from 'jquery';

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
export default class AppViewModel {
  constructor() {
    this.firstName = ko.observable('Bert');
    this.lastName = ko.observable('Bertington');
  }

  handleClick() {
    $('#root').text('HELLO WORLD');

    const currentName = this.lastName();
    this.lastName(currentName.toUpperCase());
  }
}
