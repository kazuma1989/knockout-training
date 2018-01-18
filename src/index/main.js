import ko from 'knockout';
import $ from 'jquery';
import AppViewModel from '../common/AppViewModel';
import style from './style.css';
import icon from './icon.png';

const app = new AppViewModel();

// Activates knockout.js
ko.applyBindings(app);

app.filename(icon);

$('body').addClass(style.bgred);
