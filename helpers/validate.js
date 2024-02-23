//data validation
const Validator = require('validatorjs');

Validator.register('number', function(value, requirement, attribute) {
  // Return true if the validation passes, false otherwise
  // check if the value is a number
  return /^[0-9]+$/.test(value);
  //return !isNaN(value);
});

const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;