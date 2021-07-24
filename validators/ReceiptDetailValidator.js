const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

function validateReceiptDetail(detail) {
  const schema = joi.object({
    id_receipt: joi.objectId().required(),
    id_product: joi.objectId().required(),
    quantity: joi.number().min(1).max(10000).required(),
    price: joi.number().min(1000).max(1000000000).required(),
    discount: joi.number().min(0).max(100).required(),
  });

  return schema.validate(detail);
}

module.exports = { validateReceiptDetail };
