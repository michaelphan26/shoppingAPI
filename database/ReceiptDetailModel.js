const mongoose = require('mongoose');

const ReceiptDetailSchema = mongoose.Schema({
  id_receipt: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  id_product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1000,
    max: 1000000000,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 10000,
  },
});

const ReceiptDetail = mongoose.model('ReceiptDetail', ReceiptDetailSchema);

module.exports = { ReceiptDetail };
