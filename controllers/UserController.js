const mongoose = require('mongoose');
const { User } = require('../database/UserModel');
const { UserInfo } = require('../database/UserInfoModel');
const _ = require('lodash');
const {
  validateEditUser,
  validateEditUserAdmin,
} = require('../validators/UserValidator');
const { successResponse, errorResponse } = require('../models/ResponseAPI');

//User
async function getUserDetail(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid user info id'));
  }

  const userInfo = await UserInfo.findOne({ _id: id });
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

async function editUserDetail(req, res, next) {
  const newDetail = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  };

  const validateResult = validateEditUser(newDetail);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const id = mongoose.Types.ObjectId(req.params.id);
  const result = await UserInfo.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: newDetail.name.trim(),
        phone: newDetail.phone.trim(),
        address: newDetail.address.trim(),
      },
    }
  );

  if (!result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot edit user detail'));
  }

  res
    .status(200)
    .json(
      successResponse(res.statusCode, 'Edit profile successful', newDetail)
    );
}

async function saveUserDetailAdmin(dbUser, dbUserInfo) {
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

async function editUserDetailAdmin(req, res, next) {
  let id_userInfo;
  try {
    id_userInfo = mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid user info id'));
  }

  const newDetail = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    id_role: req.body.id_role,
  };

  const validateResult = validateEditUserAdmin(newDetail);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    await UserInfo.findOneAndUpdate(
      { _id: id_userInfo },
      {
        $set: {
          name: newDetail.name.trim(),
          phone: newDetail.phone.trim(),
          address: newDetail.address.trim(),
        },
      }
    );

    await User.findOneAndUpdate(
      { id_userInfo: id_userInfo },
      {
        $set: {
          id_role: req.body.id_role,
        },
      }
    );
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot edit user detail'));
  }

  return res
    .status(200)
    .json(
      successResponse(res.statusCode, 'Edit profile successful', newDetail)
    );
}

module.exports = {
  getUserDetail,
  getAccountList,
  editUserDetail,
  editUserDetailAdmin,
};
