import { observable, extenders } from 'knockout';
import { getJSON } from 'jquery';
import { applyBindings } from '../layout';

extenders.validate = (target, { message, validator }) => {
  // detect dirty once
  target.dirty = observable(false);
  const subscription = target.subscribe(() => {
    subscription.dispose();
    target.dirty(true);
  });

  target.invalid = observable(false);
  target.errorMessage = observable('');

  const validate = newValue => {
    const isValid = validator(newValue);
    target.invalid(!isValid);
    if (isValid) {
      target.errorMessage('');
    } else {
      target.errorMessage(message);
    }
  };

  const currentValue = target();
  validate(currentValue);

  target.subscribe(validate);

  return target;
};

class AppViewModel {
  constructor() {
    this.name = observable().extend({
      validate: {
        message: 'Required',
        validator: value => value && value.trim() ? true : false
      }
    });
    this.email = observable().extend({
      validate: {
        message: 'Required',
        validator: value => value && value.trim() ? true : false
      }
    });

    this.data = observable();
  }

  isValid() {
    return !this.name.invalid() && !this.email.invalid();
  }

  search() {
    getJSON('/api/customers', { q: this.name() }, data => {
      this.data(data);
    });
  }
}

applyBindings(new AppViewModel());
