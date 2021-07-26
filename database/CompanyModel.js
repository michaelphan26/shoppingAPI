const mongoose = require('mongoose');

const CompanySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 100,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
    maxLength: 11,
  },
  address: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100,
    trim: true,
  },
  tax_number: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
    trim: true,
  },
});

const Company = mongoose.model('Company', CompanySchema);

module.exports = { Company };
