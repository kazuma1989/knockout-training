import 'es5-polyfill';
import 'knockout';
import jQuery from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';

// Bootstrap@3 needs jQuery exposed globally.
// To avoid writing 'jQuery' in webpack.config.js and keeping global jQuery exposed,
// here's some hacky code.
// see https://webpack.js.org/plugins/provide-plugin/
window.jQuery = jQuery;
require('bootstrap');
delete window.jQuery;
