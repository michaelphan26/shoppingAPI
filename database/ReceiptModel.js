const mongoose = require('mongoose');

const receiptSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 256,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    max: 1000000000,
  },
  date: {
    type: Date,
    required: true,
  },
  id_receiptType: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Receipt = mongoose.model('Receipt', receiptSchema);

exports.Receipt = Receipt;
