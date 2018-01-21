import { observable, toJS } from 'knockout';
import { applyBindings } from '../layout';

class AppViewModel {
  constructor() {
    this.name = observable();
    this.email = observable();
  }

  search() {
    console.log(toJS(this));
  }
}

applyBindings(new AppViewModel());
