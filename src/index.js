import 'es5-polyfill';
import ko from 'knockout';
import AppViewModel from './AppViewModel';

// Activates knockout.js
ko.applyBindings(new AppViewModel());
