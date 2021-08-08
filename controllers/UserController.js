const mongoose = require('mongoose');
const { User } = require('../database/UserModel');
const { UserInfo } = require('../database/UserInfoModel');
const _ = require('lodash');
const {
  validateEditUser,
  validateEditUserAdmin,
  validateAddUser,
} = require('../validators/UserValidator');
const { successResponse, errorResponse } = require('../models/ResponseAPI');
const { saveUserWithInfo } = require('./AuthController');
const bcrypt = require('bcryptjs');
const { Role } = require('../database/RoleModel');
const { checkID } = require('./CommonController');

//User
async function getUserDetail(req, res, next) {
  const userInfo = await UserInfo.findOne({ _id: req.user.id_userInfo });
  if (!userInfo) {
    res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get user detail'));
  }

  responseUser = userInfo.toObject();
  responseUser.joinDate = new Date(responseUser.joinDate).toLocaleString(
    'en-GB'
  );

  return res
    .status(200)
    .json(
      successResponse(
        res.statusCode,
        'OK',
        _.omit(responseUser, ['_id', '__v'])
      )
    );
}

async function editUserDetail(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid user info id'));
  }

  const validateResult = validateEditUser(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const result = await UserInfo.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        address: req.body.address.trim(),
      },
    },
    { new: true }
  );

  if (!result) {
    console.log('C');
    return res
      .status(400)
      .json(
        errorResponse(
          res.statusCode,
          'Cannot edit user detail or user not exist'
        )
      );
  }

  res
    .status(200)
    .json(successResponse(res.statusCode, 'Edit profile successful', result));
}

//Admin
async function getAccountList(req, res, next) {
  const userList = await User.find({}, { password: 0 });
  if (!userList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'User list is empty'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'OK', userList));
}

async function editUserDetailAdmin(req, res, next) {
  const id = checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid user id'));
  }

  const validateResult = validateEditUserAdmin(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const idRoleCheck = Role.findOne({ _id: req.body.id_role });
  if (!idRoleCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Role id not exist'));
  }

  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const saveInfo = await UserInfo.findOneAndUpdate(
      { _id: id_userInfo },
      {
        $set: {
          name: req.body.name.trim(),
          phone: req.body.phone.trim(),
          address: req.body.address.trim(),
        },
      },
      { new: true }
    ).session(session);
    if (!saveInfo) throw new Error('User info not exist');

    const saveUser = await User.findOneAndUpdate(
      { id_userInfo: id_userInfo },
      {
        $set: {
          id_role: req.body.id_role,
        },
      },
      { new: true }
    ).session(session);
    if (!saveUser) throw new Error('User not exist');
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot edit user detail'));
  }

  return res
    .status(200)
    .json(
      successResponse(res.statusCode, 'Edit profile successful', newDetail)
    );
}

async function adminAddUser(req, res, next) {
  const validateResult = validateAddUser(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  let avai = await User.findOne({ email: req.body.email.trim() });
  if (avai) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Email is already registered'));
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password.trim(), salt);

  const idRoleCheck = Role.findOne({ _id: req.body.id_role });
  if (!idRoleCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Role id not exist'));
  }

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
    id_role: req.body.id_role,
    id_userInfo: dbUserInfo._id,
  });

  const result = await saveUserWithInfo(dbUser, dbUserInfo);
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Something is wrong'));
  }

  res.status(200).json(successResponse(res.statusCode, 'Add user successful'));
}

module.exports = {
  getUserDetail,
  getAccountList,
  editUserDetail,
  editUserDetailAdmin,
  adminAddUser,
};
