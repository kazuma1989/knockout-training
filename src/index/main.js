import { applyBindings } from '../layout';
import AppViewModel from '../common/AppViewModel';
import icon from './icon.png';

// Activates knockout.js
const app = new AppViewModel();
applyBindings(app);

app.filename(icon);
