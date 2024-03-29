const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 64,
    trim: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
  },
  id_category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1000,
    max: 1000000000,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 500,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    max: 10000,
  },
  image: {
    type: String,
    trim: true,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

exports.Product = Product;
