const joi = require("joi");

function validateCategory(name) {
  const schema = joi.object({
    name: joi.string().min(2).max(50).trim().required(),
  });

  return schema.validate(name);
}

module.exports = { validateCategory };
