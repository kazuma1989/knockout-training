import { bindingHandlers, unwrap } from 'knockout';

bindingHandlers.json = {
  update: (element, valueAccessor) => {
    const value = unwrap(valueAccessor());
    element.innerText = JSON.stringify(value);
  }
};
