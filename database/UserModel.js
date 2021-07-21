const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { Role } = require('./RoleModel');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 256,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 1024,
    trim: true,
  },
  id_role: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  id_userInfo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

userSchema.methods.generateToken = async function (user) {
  const token = jwt.sign(user, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', userSchema);

exports.User = User;
