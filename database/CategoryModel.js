const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 20,
    unique: true,
  },
});

module.exports.Role = mongoose.model("Category", categorySchema);
