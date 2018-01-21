import ko from 'knockout';
import $ from 'jquery';

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
export default class AppViewModel {
  constructor() {
    this.firstName = ko.observable('Bert');
    this.lastName = ko.observable('Bertington');

    this.filename = ko.observable();

    this.list = [
      { firstName: 'Bert', lastName: 'Bertington' },
      { firstName: 'Charles', lastName: 'Charlesforth' },
      { firstName: 'Denise', lastName: 'Dentiste' },
      { firstName: 'Denise', lastName: 'Dentiste' },
    ];

    this.data = ko.observable();
    $.getJSON('/api/comments/1', data => {
      this.data(data);
    });
  }

  handleClick() {
    $('#root').text('HELLO WORLD');

    const currentName = this.lastName();
    this.lastName(currentName.toUpperCase());
  }
}
