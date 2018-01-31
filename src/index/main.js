import { applyBindings } from '../layout';
import Index from './Index';
import css from './style.css';

import './test.html';

// Activates knockout.js
const app = new Index();
applyBindings(app);

console.log(css);
