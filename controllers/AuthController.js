const {
  validateLogin,
  validateRegister,
  validateAddUser,
} = require('../validators/UserValidator');
const mongoose = require('mongoose');
const { User } = require('../database/UserModel');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { successResponse, errorResponse } = require('../models/ResponseAPI');
const { Role } = require('../database/RoleModel');
const { UserInfo } = require('../database/UserInfoModel');

async function saveUserWithInfo(dbUser, dbUserInfo) {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    await dbUserInfo.save();
    await dbUser.save();
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    return false;
  }
  await session.commitTransaction();
  await session.endSession();
  return true;
}

async function sendToken(res, msg, user) {
  const role = await Role.findOne({ _id: user.id_role });
  const tokenDetail = {
    email: user.email,
    id_userInfo: user.id_userInfo,
    id_role: user.id_role,
    role_name: role.name,
  };
  console.log(tokenDetail);
  const token = await user.generateToken(tokenDetail);
  return res
    .header('x-auth-token', token)
    .status(200)
    .json(successResponse(res.statusCode, msg, tokenDetail));
}

async function authRegister(req, res, next) {
  let avai = await User.findOne({ email: req.body.email.trim() });
  if (avai) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Email is already registered'));
  }

  //dd-mm-yy with 24h

  const user = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  };

  const validateResult = validateRegister(user);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const role = await Role.findOne({ name: 'User' });

  const date = new Date();
  const dbUserInfo = new UserInfo({
    name: user.name.trim(),
    phone: user.phone.trim(),
    address: user.address.trim(),
    joinDate: date,
  });

  const dbUser = new User({
    email: user.email.trim(),
    password: user.password.trim(),
    id_role: role._id,
    id_userInfo: dbUserInfo._id,
  });

  const result = await saveUserWithInfo(dbUser, dbUserInfo);
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Something is wrong'));
  }

  sendToken(res, 'OK', dbUser);
}

async function authLogin(req, res, next) {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const validateResult = validateLogin(user);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const dbUser = await User.findOne({ email: user.email.trim() });
  if (!dbUser) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Email or password is incorrect'));
  }

  const check = bcrypt.compare(req.body.password.trim(), dbUser.password);

  if (!check) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Email or password is incorrect'));
  }

  sendToken(res, 'OK', dbUser);
}

module.exports = {
  authLogin,
  authRegister,
  sendToken,
  saveUserWithInfo,
};
