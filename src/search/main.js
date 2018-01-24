import { observable, extenders, computed } from 'knockout';
import { getJSON } from 'jquery';
import { applyBindings } from '../layout';

extenders.validate = (target, { message, validator }) => {
  // detect pristine once
  target.pristine = observable(true);
  const subscription = target.subscribe(() => {
    subscription.dispose();
    target.pristine(false);
  });

  target.valid = observable(false);
  target.errorMessage = computed(() => target.valid() ? '' : message);
  target.subscribe(validator);

  return target;
};

class AppViewModel {
  constructor() {
    this.id = observable().extend({
      validate: {
        message: 'Invalid id',
        validator: () => this.validateId()
      }
    });

    this.name = observable().extend({
      validate: {
        message: 'Invalid name',
        validator: () => this.validateProfile()
      }
    });

    this.email = observable().extend({
      validate: {
        message: 'Invalid email',
        validator: () => this.validateProfile()
      }
    });

    this.customers = observable();
  }

  validateId() {
    const id = this.id();
    if (id && id.trim()) {
      this.id.valid(true);
    }
    else {
      this.id.valid(false);
    }
  }

  validateProfile() {
    const name = this.name();
    if (name && name.trim()) {
      this.name.valid(true);
      this.email.valid(true);
    }
    else {
      const email = this.email();
      if (email && email.trim()) {
        this.name.valid(true);
        this.email.valid(true);
      }
      else {
        this.name.valid(false);
        this.email.valid(false);
      }
    }
  }

  search() {
    getJSON('/api/customers', { q: this.name() }, customers => {
      this.customers(customers);
    });
  }
}

applyBindings(new AppViewModel());
