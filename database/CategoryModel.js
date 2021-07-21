const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 30,
    unique: true,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports.Category = Category;
