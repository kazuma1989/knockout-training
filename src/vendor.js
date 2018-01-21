import 'es5-polyfill';
import 'knockout';
import jQuery from 'jquery';
import 'bootstrap/less/bootstrap.less';

// Bootstrap@3 needs jQuery exposed globally.
// To avoid writing 'jQuery' in webpack.config.js and keeping global jQuery exposed,
// here's some hacky code.
// see https://webpack.js.org/plugins/provide-plugin/
window.jQuery = jQuery;
require('bootstrap/js/transition.js');
require('bootstrap/js/collapse.js');
window.jQuery = undefined;
