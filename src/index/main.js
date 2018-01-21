import { applyBindings } from '../layout';
import AppViewModel from './AppViewModel';

// Activates knockout.js
const app = new AppViewModel();
applyBindings(app);
