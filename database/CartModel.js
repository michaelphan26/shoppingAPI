const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
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
  email: {
    type: String,
    minLength: 5,
    maxLength: 256,
    trim: true,
    required: true,
  },
  total: {
    type: Number,
    min: 0,
    max: 1000000000,
    required: true,
  },
});

module.exports.Cart = mongoose.model("Cart", cartSchema);
