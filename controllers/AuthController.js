const {
  validateLogin,
  validateRegister,
  validateAddUser,
} = require("../validators/UserValidator");
const mongoose = require("mongoose");
const { User, generateToken } = require("../database/UserModel");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { successResponse, errorResponse } = require("../models/ResponseAPI");
const { userDetailResponse } = require("./UserController");
const jwt = require("jsonwebtoken");
const config = require("config");

async function cleanupToken(user) {
  const tempArray = [];
  for (const index in user.tokenList) {
    try {
      const ver = jwt.verify(
        user.tokenList[index],
        config.get("jwtPrivateKey")
      );
      tempArray.push(user.tokenList[index]);
    } catch (err) {
      console.log("Remove outdate token");
    }
  }
  user.tokenList = tempArray;
}

async function saveToken(user, token) {
  user.tokenList.push(token);
  await user.save();
}

async function sendToken(res, msg, user) {
  const token = await user.generateToken();
  saveToken(user, token);
  return res
    .header("x-auth-token", token)
    .status(200)
    .json(successResponse(res.statusCode, msg, userDetailResponse(user)));
}

async function authRegister(req, res, next) {
  let avai = await User.findOne({ email: req.body.email.trim() });
  if (avai) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Email is already registered"));
  }

  //dd-mm-yy with 24h
  const date = new Date().toLocaleString("en-GB");
  const user = {
    email: req.body.email.trim(),
    password: req.body.password.trim(),
    name: req.body.name.trim(),
    phone: req.body.phone.trim(),
    address: req.body.address.trim(),
  };

  const validateResult = validateRegister(user);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const role =
    req.body.admin === false || req.body.admin === undefined ? false : true;

  const dbUser = new User({
    email: user.email,
    password: user.password,
    name: user.name,
    phone: user.phone,
    address: user.address,
    joinDate: date,
    admin: role,
    tokenList: [],
  });

  const result = await dbUser.save();
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, "Something is wrong"));
  }

  sendToken(res, "OK", dbUser);
}

async function authLogin(req, res, next) {
  const user = {
    email: req.body.email.trim(),
    password: req.body.password.trim(),
  };

  const validateResult = validateLogin(user);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const dbUser = await User.findOne({ email: user.email });

  const check = bcrypt.compare(req.body.password, dbUser.password);

  if (!check) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Email or password is incorrect"));
  }

  cleanupToken(dbUser);

  if (dbUser.tokenList.length === 3) {
    return res
      .status(401)
      .json(errorResponse(res.statusCode, "Too many devices"));
  }

  sendToken(res, "OK", dbUser);
}

async function authLogout(req, res, next) {
  const token = req.header("x-auth-token");
  const dbUser = await User.findOne({
    email: req.user.email,
  });

  dbUser.tokenList = dbUser.tokenList.filter((item) => item.id !== token);

  cleanupToken(dbUser);

  const result = await dbUser.save();
  if (!result)
    return res
      .status(500)
      .json(successResponse(res.statusCode, "Logout failed"));

  return res
    .status(200)
    .json(successResponse(res.statusCode, "Logout successful"));
}

async function adminAddAccount(req, res, next) {
  let avai = await User.findOne({ email: req.body.email.trim() });
  if (avai) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Email is already registered"));
  }

  //dd-mm-yy with 24h
  const date = new Date().toLocaleString("en-GB");
  const user = {
    email: req.body.email.trim(),
    password: req.body.password.trim(),
    name: req.body.name.trim(),
    phone: req.body.phone.trim(),
    address: req.body.address.trim(),
    admin: req.body.admin,
  };

  const validateResult = validateAddUser(user);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const role =
    req.body.admin === false || req.body.admin === undefined ? false : true;

  const dbUser = new User({
    email: user.email,
    password: user.password,
    name: user.name,
    phone: user.phone,
    address: user.address,
    joinDate: date,
    admin: role,
    tokenList: [],
  });

  const result = await dbUser.save();
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, "Something is wrong"));
  }

  res.status(200).json(successResponse(res.statusCode, "Add user successful"));
}

module.exports = {
  authLogin,
  authRegister,
  adminAddAccount,
  sendToken,
  authLogout,
};
