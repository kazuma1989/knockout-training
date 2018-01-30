import { observable, extenders, pureComputed, toJS } from 'knockout';

extenders.validate = (target, validator) => {
  // detect pristine once
  target.pristine = observable(true);
  const subscription = target.subscribe(() => {
    target.pristine(false);
    subscription.dispose();
  });

  const _error = observable({});
  if (validator) {
    target.error = pureComputed({
      read: () => Object.assign({}, validator(toJS(target), target), _error()),
      write: _error
    });
  }
  else {
    target.error = _error;
  }

  target.valid = pureComputed(() => Object.keys(target.error()).length === 0);

  return target;
};
