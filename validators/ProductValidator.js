const joi = require('joi');

function validateProduct(product) {
    const schema = joi.object({
        name: joi.string().min(2).max(64).trim().required(),
        brand: joi.string().min(3).max(20).trim().required(),
        category: joi.string().min(2).max(20).trim().required(),
        price: joi.number().min(1000).max(1000000000).required(),
        stock: joi.number().min(0).max(1000).required(),
        image:joi.string().trim().empty('')
    })

    return schema.validate(product);
}

module.exports={validateProduct}