import ko from 'knockout';
import AppViewModel from '../common/AppViewModel';

// Activates knockout.js
const app = new AppViewModel();
ko.applyBindings(app, document.getElementById('main'));
