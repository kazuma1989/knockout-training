import { observable, extenders, pureComputed, toJS } from 'knockout';
import { getJSON } from 'jquery';
import { applyBindings } from '../layout';

extenders.validate = (target, { message, validator }) => {
  // detect pristine once
  target.pristine = observable(true);
  const subscription = target.subscribe(() => {
    target.pristine(false);
    subscription.dispose();
  });

  target.valid = validator ? pureComputed(validator) : observable(false);
  target.errorMessage = pureComputed(() => target.valid() ? '' : message);

  return target;
};

class AppViewModel {
  constructor() {
    const id = observable().extend({
      validate: {
        message: 'Invalid ID',
        validator: () => this.validateId()
      }
    });
    this.id = id;

    const name = observable().extend({
      validate: {
        message: 'Invalid name',
      }
    });
    const email = observable().extend({
      validate: {
        message: 'Invalid email',
      }
    });
    this.profile = pureComputed(() => ({
      name,
      email
    })).extend({
      validate: {
        message: 'Invalid profile',
        validator: () => this.validateProfile()
      }
    });

    this.customers = observable();
  }

  validateId() {
    const id = this.id();
    if (id && id.trim()) {
      return true;
    }
    else {
      return false;
    }
  }

  validateProfile() {
    const { name, email } = this.profile();
    if (name() && name().trim()) {
      name.valid(true);
      email.valid(true);
      return true;
    }
    else {
      if (email() && email().trim()) {
        name.valid(true);
        email.valid(true);
        return true;
      }
      else {
        name.valid(false);
        email.valid(false);
        return false;
      }
    }
  }

  search() {
    const { profile } = toJS(this);
    getJSON('/api/customers', { q: profile.name }, customers => {
      this.customers(customers);
    });
  }
}

applyBindings(new AppViewModel());
