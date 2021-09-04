const joi = require('joi');

function validateReceipt(receipt) {
  const schema = joi.object({
    productList: joi
      .array()
      .items(
        joi.object({
          id_product: joi.objectId().required(),
          price: joi.number().min(1000).max(1000000000).required(),
          discount: joi.number().min(0).max(100).required(),
          quantity: joi.number().min(1).max(10000).required(),
        })
      )
      .required()
      .min(0),
    total: joi.number().min(0).max(1000000000).required(),
  });

  return schema.validate(receipt);
}

module.exports = { validateReceipt };

//total: joi.number().min(1000).max(1000000000).required(),
//email: joi.string().min(5).max(256).trim().email().required(),
//id_receiptType: joi.objectId().required(),
