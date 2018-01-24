import { observable, extenders, pureComputed } from 'knockout';
import { getJSON } from 'jquery';
import { applyBindings } from '../layout';

extenders.validate = (target, { message, validator }) => {
  // detect pristine once
  target.pristine = observable(true);
  const subscription = target.subscribe(() => {
    target.pristine(false);
    subscription.dispose();
  });

  target.valid = observable(false);
  target.errorMessage = pureComputed(() => target.valid() ? '' : message);
  target.subscribe(validator);

  return target;
};

class AppViewModel {
  constructor() {
    this.id = observable('initial').extend({
      validate: {
        message: 'Invalid id',
        validator: () => this.validateId()
      }
    });
    this.validateId();

    this.profile = {
      name: observable().extend({
        validate: {
          message: 'Invalid name',
          validator: () => this.validateProfile()
        }
      }),
      email: observable().extend({
        validate: {
          message: 'Invalid email',
          validator: () => this.validateProfile()
        }
      })
    };
    this.validateProfile();
    this.profile.valid = pureComputed(() => {
      const { name, email } = this.profile;
      return name.valid() && email.valid();
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
    const { name, email } = this.profile;
    if (name() && name().trim()) {
      name.valid(true);
      email.valid(true);
    }
    else {
      if (email() && email().trim()) {
        name.valid(true);
        email.valid(true);
      }
      else {
        name.valid(false);
        email.valid(false);
      }
    }
  }

  search() {
    getJSON('/api/customers', { q: this.profile.name() }, customers => {
      this.customers(customers);
    });
  }
}

applyBindings(new AppViewModel());
