const mongoose = require("mongoose");

const receiptSchema = mongoose.Schema({
  productList: {
    type: Array,
    minLength: 1,
    required: true,
  },
  date: {
    type: String,
    required: true,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
    min: 1000,
    max: 1000000000,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const Receipt = mongoose.model("Receipt", receiptSchema);

exports.Receipt = Receipt;
