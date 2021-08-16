const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

function validateProduct(product) {
  const schema = joi.object({
    name: joi.string().min(2).max(64).trim().required(),
    brand: joi.string().min(3).max(20).trim().required(),
    price: joi.number().min(1000).max(1000000000).required(),
    description: joi.string().trim().min(5).max(200).required(),
    discount: joi.number().min(0).max(100).required(),
    id_category: joi.objectId().required(),
    image: joi.string().base64().required(),
  });

  return schema.validate(product);
}

module.exports = { validateProduct };
