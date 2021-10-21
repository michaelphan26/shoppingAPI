const {
  validateLogin,
  validateRegister,
  validateAddUser,
  validateChangePassword,
} = require('../validators/UserValidator');
const mongoose = require('mongoose');
const { User } = require('../database/UserModel');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { successResponse, errorResponse } = require('../models/ResponseAPI');
const { Role } = require('../database/RoleModel');
const { UserInfo } = require('../database/UserInfoModel');

async function saveUserWithInfo(dbUser, dbUserInfo) {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    await dbUserInfo.save({ session });
    await dbUser.save({ session });
    await session.commitTransaction();
    await session.endSession();
    return true;
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    return false;
  }
}

async function sendToken(res, msg, user, roleName) {
  const tokenDetail = {
    _id: user._id,
    email: user.email,
    id_userInfo: user.id_userInfo,
    id_role: user.id_role,
    role_name: roleName,
  };
  const token = await user.generateToken(tokenDetail);
  return res
    .setHeader('x-auth-token', token)
    .status(200)
    .json(successResponse(res.statusCode, msg, tokenDetail));
}

async function authRegister(req, res, next) {
  const validateResult = validateRegister(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  reg = new RegExp(`^${req.body.email.trim()}$`, 'i');
  let avai = await User.findOne({ email: reg });
  if (avai) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Email is already registered'));
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password.trim(), salt);

  const role = await Role.findOne({ name: /^khách hàng$/i });

  const date = new Date();
  const dbUserInfo = new UserInfo({
    name: req.body.name.trim(),
    phone: req.body.phone.trim(),
    address: req.body.address.trim(),
    joinDate: date,
  });

  const dbUser = new User({
    email: req.body.email.trim(),
    password: req.body.password.trim(),
    id_role: role._id,
    id_userInfo: dbUserInfo._id,
  });

  const result = await saveUserWithInfo(dbUser, dbUserInfo);
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot register'));
  }

  sendToken(res, 'OK', dbUser, role.name);
}

async function authLogin(req, res, next) {
  const validateResult = validateLogin(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const dbUser = await User.findOne({ email: req.body.email.trim() });
  if (!dbUser) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Email or password is incorrect'));
  }

  const check = await bcrypt.compare(req.body.password.trim(), dbUser.password);

  if (!check) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Email or password is incorrect'));
  }

  const role = await Role.findOne({ _id: dbUser.id_role });

  sendToken(res, 'OK', dbUser, role.name);
}

async function changePassword(req, res, next) {
  const validateResult = validateChangePassword(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const dbCheck = await User.findOne({ _id: req.user._id });
  if (!dbCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'User not existed'));
  }

  const comparePassword = await bcrypt.compare(
    req.body.oldPassword.trim(),
    dbCheck.password
  );

  if (!comparePassword) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Old password is not correct'));
  }

  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(req.body.newPassword.trim(), salt);

  const result = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: {
        password: newPassword,
      },
    },
    { new: true }
  );

  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot change password'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok'));
}

module.exports = {
  authLogin,
  authRegister,
  sendToken,
  saveUserWithInfo,
  changePassword,
};
