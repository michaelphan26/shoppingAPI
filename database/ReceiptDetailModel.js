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
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 1000,
  },
});

const ReceiptDetail = mongoose.model('ReceiptDetail', ReceiptDetailSchema);

module.exports = { ReceiptDetail };
