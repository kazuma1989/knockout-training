import { observable, computed } from 'knockout';
import { getJSON } from 'jquery';

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
export default class AppViewModel {
  constructor() {
    this.panels = observable();
    getJSON('/api/panels', panels => {
      panels.forEach(panel => {
        panel.isPrimary = panel.id === 1;
        panel.isSecondary = panel.id === 2;
      });
      this.panels(panels);
    });

    this.withSupports = observable(false);
    this.withErrors = observable(false);
  }

  filterOut(panel) {
    const isFilteringOn = this.withSupports();
    if (isFilteringOn) {
      return panel.supports.length === 0;
    } else {
      return false;
    }
  }
}
