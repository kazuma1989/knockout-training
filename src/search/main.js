import { observable, pureComputed, toJS } from 'knockout';
import { bindingHandlers, unwrap } from 'knockout';
import { getJSON } from 'jquery';
import '../common/extend-validate';
import { applyBindings } from '../layout';

bindingHandlers.json = {
  update: (element, valueAccessor) => {
    const value = unwrap(valueAccessor());
    element.innerText = JSON.stringify(value);
  }
};

class AppViewModel {
  constructor() {
    const id = observable().extend({
      validate: this.validateId
    });
    this.id = id;

    const name = observable().extend({
      validate: null
    });
    const email = observable().extend({
      validate: this.validateEmail
    });
    const gender = observable().extend({
      validate: this.validateGender
    });
    gender.subscribe(value => {
      gender(value.toUpperCase());
    });
    this.profile = pureComputed(() => ({
      name,
      email,
      gender,
    })).extend({
      validate: this.validateProfile
    });

    this.customers = observable();
  }

  validateId(id) {
    id = (id || '').trim();
    if (!id) {
      return { required: 'ID is required.' };
    }
    else if (id.length <= 7) {
      return { length: 'ID must be longer than 8 digits.' };
    }
    else {
      return {};
    }
  }

  validateEmail(email) {
    email = (email || '').trim();
    if (!email || email.includes('@')) {
      return {};
    }
    else {
      return { format: 'Invalid format.' };
    }
  }

  validateGender(gender) {
    gender = (gender || '').trim();
    switch (gender) {
      case 'MALE':
      case 'FEMALE':
      case 'OTHER':
      case '':
        return {};

      default:
        return { unknown: 'Unknown gender.' };
    }
  }

  validateProfile(value, profile) {
    const { name, email, gender } = profile();

    const nameValue = (value.name || '').trim();
    const emailValue = (value.email || '').trim();
    if (nameValue) {
      name.error({});
      email.error({});
    }
    else if (emailValue) {
      name.error({});
      email.error({});
    }
    else {
      const required = 'Either name or email is required.';
      name.error({ required });
      email.error({ required });
    }

    const error = {};
    if (!name.valid()) {
      error.name = name.error();
    }
    if (!email.valid()) {
      error.email = email.error();
    }
    if (!gender.valid()) {
      error.gender = gender.error();
    }
    return error;
  }

  search() {
    const { profile } = toJS(this);
    getJSON('/api/customers', { q: profile.name }, customers => {
      this.customers(customers);
    });
  }
}

applyBindings(new AppViewModel());
