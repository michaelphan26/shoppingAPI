const mongoose = require('mongoose');

const IOProductDetailSchema = mongoose.Schema({
  id_IOProduct: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
  },
  id_product: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    max: 1000,
    required: true,
  },
  price: {
    type: Number,
    min: 1000,
    max: 1000000000,
  },
  id_company: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
  },
});

const IOProductDetail = mongoose.model(
  'IOProductDetail',
  IOProductDetailSchema
);

module.exports = { IOProductDetail };
