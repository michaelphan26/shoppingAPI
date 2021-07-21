const joi = require('joi');

function validateRole(name) {
  const schema = joi.object({
    name: joi.string().min(2).max(20).trim().required(),
  });
  return schema.validate(name);
}

module.exports = { validateRole };
