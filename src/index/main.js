import ko from 'knockout';
import AppViewModel from '../common/AppViewModel';
import './style.css';
import icon from './icon.png';

const app = new AppViewModel();

// Activates knockout.js
ko.applyBindings(app);

app.filename(icon);
