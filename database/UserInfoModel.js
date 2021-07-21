const mongoose = require('mongoose');

const UserInfoSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 11,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100,
    trim: true,
  },
  joinDate: {
    type: Date,
    required: true,
    trim: true,
  },
});

const UserInfo = mongoose.model('UserInfo', UserInfoSchema);
module.exports = { UserInfo };
