import ko from 'knockout';
import Navbar from './Navbar';

// Activates knockout.js
export function applyBindings(app) {
  const navbar = new Navbar();
  ko.applyBindings(navbar, document.getElementById('navbar'));

  if (app) {
    ko.applyBindings(app, document.getElementById('main'));
  }
}
