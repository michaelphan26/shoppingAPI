const joi=require('joi')

//Truyền vào req.body
function validateLogin(loginDetail){
    const schema=joi.object({
        email:joi.string().min(5).max(256).trim().email().required(),
        password:joi.string().min(8).max(1024).required()
    })

    return schema.validate(loginDetail)
};

function validateRegister(registerDetail){
    const schema = joi.object({
        email:joi.string().min(5).max(256).trim().email().required(),
        password:joi.string().min(8).max(1024).required(),
        name:joi.string().min(2).max(50).trim().required(),
        phone:joi.string().min(10).max(12).trim().pattern(/((09|03|07|08|05)+([0-9]{8})\b)/).required(),
        address:joi.string().min(5).max(100).trim().required(),
    })

    return schema.validate(registerDetail)
};

module.exports={validateLogin,validateRegister};