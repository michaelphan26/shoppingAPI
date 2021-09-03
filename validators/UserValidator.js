const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

//Truyền vào req.body
function validateLogin(loginDetail) {
  const schema = joi.object({
    email: joi.string().min(5).max(256).trim().email().required(),
    password: joi.string().min(8).max(1024).required(),
  });

  return schema.validate(loginDetail);
}

function validateRegister(registerDetail) {
  const schema = joi.object({
    email: joi.string().min(5).max(256).trim().email().required(),
    password: joi.string().min(8).max(1024).required(),
    name: joi.string().min(2).max(50).trim().required(),
    phone: joi
      .string()
      .min(10)
      .max(11)
      .trim()
      .pattern(/((09|03|07|08|05)+([0-9]{8})\b)/)
      .required(),
    address: joi.string().min(5).max(100).trim().required(),
  });

  return schema.validate(registerDetail);
}

function validateAddUser(addDetail) {
  const schema = joi.object({
    email: joi.string().min(5).max(256).trim().email().required(),
    password: joi.string().min(8).max(1024).required(),
    name: joi.string().min(2).max(50).trim().required(),
    phone: joi
      .string()
      .min(10)
      .max(11)
      .trim()
      .pattern(/((02|09|03|07|08|05)+([0-9]{9})\b)/)
      .required(),
    address: joi.string().min(5).max(100).trim().required(),
    id_role: joi.objectId().required(),
  });

  return schema.validate(addDetail);
}

function validateEditUser(newDetail) {
  const schema = joi.object({
    name: joi.string().min(2).max(50).trim().required(),
    phone: joi
      .string()
      .min(10)
      .max(12)
      .trim()
      .pattern(/((09|03|07|08|05)+([0-9]{8})\b)/)
      .required(),
    address: joi.string().min(5).max(100).trim().required(),
  });

  return schema.validate(newDetail);
}

function validateEditUserAdmin(newDetail) {
  const schema = joi.object({
    name: joi.string().min(2).max(50).trim().required(),
    phone: joi
      .string()
      .min(10)
      .max(12)
      .trim()
      .pattern(/((09|03|07|08|05)+([0-9]{8})\b)/)
      .required(),
    address: joi.string().min(5).max(100).trim().required(),
    id_role: joi.objectId().required(),
  });

  return schema.validate(newDetail);
}

function validateChangePassword(password) {
  const schema = joi.object({
    oldPassword: joi.string().min(8).max(30).required().trim(),
    newPassword: joi
      .string()
      .min(8)
      .max(30)
      .required()
      .trim()
      .disallow(joi.ref('oldPassword')),
    confirmPassword: joi
      .string()
      .min(8)
      .max(30)
      .required()
      .trim()
      .valid(joi.ref('newPassword')),
  });

  return schema.validate(password);
}

module.exports = {
  validateLogin,
  validateRegister,
  validateAddUser,
  validateEditUser,
  validateEditUserAdmin,
  validateChangePassword,
};
