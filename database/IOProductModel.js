const mongoose = require('mongoose');

const IOProductSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  id_ioType: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const IOProduct = mongoose.model('IOProduct', IOProductSchema);

module.exports = { IOProduct };
