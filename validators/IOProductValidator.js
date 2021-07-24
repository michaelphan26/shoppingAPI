const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

function validateIOProduct(detail) {
  const schema = joi.object({
    id_ioType: joi.objectId().required(),
    productList: joi.array().items(
      joi.object({
        id_product: joi.objectId().required(),
        quantity: joi.number().min(1).max(10000).required(),
        price: joi.number().min(1000).max(1000000000).required(),
        id_company: joi.objectId().required(),
      })
    ),
  });
  return schema.validate(detail);
}

module.exports = { validateIOProduct };
