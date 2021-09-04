const joi = require('joi');

function validateCompany(company) {
  const schema = joi.object({
    name: joi.string().trim().min(3).max(100).required(),
    phone: joi
      .string()
      .trim()
      .min(10)
      .max(11)
      .pattern(/((02|09|03|07|08|05)+([0-9]{8,9})\b)/)
      .required(),
    address: joi.string().trim().min(5).max(100).required(),
    tax_number: joi.string().trim().min(5).max(50).required(),
  });

  return schema.validate(company);
}

module.exports = { validateCompany };
