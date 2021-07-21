const joi = require('joi');

function validateReceiptType(name) {
  const schema = joi.object({
    name: joi.string().trim().min(2).max(20).required(),
  });

  return schema.validate(name);
}

module.exports = { validateReceiptType };
