const joi = require('joi');

function validateIOType(name) {
  const schema = joi.object({
    name: joi.string().trim().min(2).max(30).required(),
  });

  return schema.validate(name);
}

module.exports = { validateIOType };
