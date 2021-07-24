const mongoose = require('mongoose');

const receiptTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 20,
    unique: true,
  },
});

const ReceiptType = mongoose.model('ReceiptType', receiptTypeSchema);
module.exports.ReceiptType = ReceiptType;
