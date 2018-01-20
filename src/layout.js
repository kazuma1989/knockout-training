import ko from 'knockout';
import Navbar from './navbar';

// Activates knockout.js
export function applyBindings(app) {
  const navbar = new Navbar();
  ko.applyBindings(navbar, document.getElementById('navbar'));

  ko.applyBindings(app, document.getElementById('main'));
}
