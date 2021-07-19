const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);

function validateProduct(body) {
  const schema = joi.object({
    productID: joi.objectId().required(),
    quantity: joi.number().min(0).required(),
  });

  return schema.validate(body);
}

module.exports = { validateProduct };
