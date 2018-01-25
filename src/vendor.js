import 'es5-polyfill';
import { bindingHandlers } from 'knockout';
import jQuery from 'jquery';
import './bootstrap-custom.less';

// Bootstrap@3 needs jQuery exposed globally.
// To avoid writing 'jQuery' in webpack.config.js and keeping global jQuery exposed,
// here's some hacky code.
// see https://webpack.js.org/plugins/provide-plugin/
window.jQuery = jQuery;
require('bootstrap/js/transition.js');
require('bootstrap/js/collapse.js');
window.jQuery = undefined;

// Replace textInput handler, fired every key types, to value handler, fired only when focus out
// because of low IE8 performance.
if (window.ltie9) {
  bindingHandlers.textInput = bindingHandlers.value;
}
