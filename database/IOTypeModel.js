const mongoose = require('mongoose');

const IOTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 30,
    unique: true,
  },
});

const IOType = mongoose.model('IOType', IOTypeSchema);

module.exports = { IOType };
