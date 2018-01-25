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
extenders.validate2 = (target, validator) => {
  // detect pristine once
  target.pristine = observable(true);
  const subscription = target.subscribe(() => {
    target.pristine(false);
    subscription.dispose();
  });

  target.error = validator ? pureComputed(validator) : observable({});
  target.valid = pureComputed(() => Object.keys(target.error()).length === 0);

  return target;
};

class AppViewModel {
  constructor() {
    const id = observable().extend({
      validate2: () => this.validateId()
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
    const gender = observable().extend({
      validate: {
        message: 'Invalid gender',
        validator: () => this.validateGender()
      }
    });
    gender.subscribe(value => {
      gender(value.toUpperCase());
    });
    this.profile = pureComputed(() => ({
      name,
      email,
      gender,
    })).extend({
      validate: {
        message: 'Invalid profile',
        validator: () => this.validateProfile()
      }
    });

    this.customers = observable();
  }

  validateId() {
    const required = 'ID is required.';
    const length = 'ID must be longer than 8 digits.';

    const id = (this.id() || '').trim();
    if (!id) {
      return {
        required
      };
    }
    else {
      if (id.length <= 7) {
        return {
          length
        };
      }
      else {
        return {};
      }
    }
  }

  validateGender() {
    const { gender } = this.profile();
    switch (gender() && gender().trim()) {
      case 'MALE':
      case 'FEMALE':
      case 'OTHER':
      case '':
      case undefined:
        return true;
      default:
        return false;
    }
  }

  validateProfile() {
    const { name, email, gender } = this.profile();

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

    return name.valid() && email.valid() && gender.valid();
  }

  search() {
    const { profile } = toJS(this);
    getJSON('/api/customers', { q: profile.name }, customers => {
      this.customers(customers);
    });
  }
}

applyBindings(new AppViewModel());
