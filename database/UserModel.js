const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

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
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 12,
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
    type: String,
    required: true,
    trim: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  tokenList: {
    type: Array,
    minLength: 0,
    maxLength: 3,
  },
});

userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { email: this.email, name: this.name, admin: this.admin },
    config.get("jwtPrivateKey"),
    { expiresIn: "12h" }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

exports.User = User;
