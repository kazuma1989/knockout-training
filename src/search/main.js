import { observable, extenders, pureComputed, toJS } from 'knockout';
import { bindingHandlers, unwrap } from 'knockout';
import { getJSON } from 'jquery';
import { applyBindings } from '../layout';

bindingHandlers.json = {
  update: (element, valueAccessor) => {
    const value = unwrap(valueAccessor());
    element.innerText = JSON.stringify(value);
  }
};

extenders.validate = (target, validator) => {
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
      validate: () => this.validateId()
    });
    this.id = id;

    const name = observable().extend({
      validate: null
    });
    const email = observable().extend({
      validate: null
    });
    const gender = observable().extend({
      validate: () => this.validateGender()
    });
    gender.subscribe(value => {
      gender(value.toUpperCase());
    });
    this.profile = pureComputed(() => ({
      name,
      email,
      gender,
    })).extend({
      validate: () => this.validateProfile()
    });

    this.customers = observable();
  }

  validateId() {
    const required = 'ID is required.';
    const length = 'ID must be longer than 8 digits.';

    const id = (this.id() || '').trim();
    if (!id) {
      return { required };
    }
    else if (id.length <= 7) {
      return { length };
    }
    else {
      return {};
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
        return {};
      default:
        return {
          unknown: 'Unknown gender'
        };
    }
  }

  validateProfile() {
    const { name, email, gender } = this.profile();

    if (name() && name().trim()) {
      name.error({});
      email.error({});
    }
    else if (email() && email().trim()) {
      name.error({});
      email.error({});
    }
    else {
      const required = 'Either name or email is required';
      name.error({ required });
      email.error({ required });
    }

    const isValid = name.valid() && email.valid() && gender.valid();
    return isValid ? {} : { error: 'Something goes wrong' };
  }

  search() {
    const { profile } = toJS(this);
    getJSON('/api/customers', { q: profile.name }, customers => {
      this.customers(customers);
    });
  }
}

applyBindings(new AppViewModel());
