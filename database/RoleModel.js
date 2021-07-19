const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 20,
    unique: true,
  },
});

module.exports.Role = mongoose.model("role", roleSchema);
