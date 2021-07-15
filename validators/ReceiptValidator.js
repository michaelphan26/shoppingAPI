const joi=require('joi')

function validateReceipt(receipt) {
    const schema = joi.object({
        productList: joi.array().items(
            joi.object({
                _id:joi.any(),
                name: joi.string().min(2).max(64).trim().required(),
                brand: joi.string().min(3).max(20).trim().required(),
                category: joi.string().min(2).max(20).trim().required(),
                price: joi.number().min(1000).max(1000000000).required(),
                stock: joi.number().min(0).max(1000).required(),
                image:joi.object()
            })
        ).required().min(1),
        total: joi.number().min(1000).max(1000000000).required()
    })

    return schema.validate(receipt)
}

module.exports={validateReceipt}