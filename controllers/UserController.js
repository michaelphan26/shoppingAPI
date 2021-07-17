const mongoose = require("mongoose");
const { User } = require("../database/UserModel");
const { sendToken } = require("../controllers/AuthController");
const _ = require("lodash");
const { validateEditUser } = require("../validators/UserValidator");
const { successResponse, errorResponse } = require("../models/ResponseAPI");

function userDetailResponse(user) {
  return _.omit(user.toObject(), ["_id", "password", "__v"]);
}

//User
async function getUserDetail(req, res, next) {
  const email = req.user.email;
  const user = await User.findOne({ email: email });
  if (!user) {
    res
      .status(400)
      .json(errorResponse(res.statusCode, "Cannot get user detail"));
  }

  return res
    .status(200)
    .json(successReponse(res.statusCode, "OK", userDetailResponse(user)));
}

//Admin
async function getAccountList(req, res, next) {
  const userList = await User.find({});
  if (!userList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "User list is empty"));
  }

  return res.status(200).json(successResponse(res.statusCode, "OK", userList));
}

async function editUserDetail(req, res, next) {
  const role =
    req.body.admin === false || req.body.admin === undefined ? false : true;
  const newDetail = {
    name: req.body.name.trim(),
    phone: req.body.phone.trim(),
    address: req.body.address.trim(),
    admin: role,
  };

  const validateResult = validateEditUser(newDetail);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const id = mongoose.Types.ObjectId(req.params.id);
  const result = await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: newDetail.name,
        phone: newDetail.phone,
        address: newDetail.address,
        admin: newDetail.role,
      },
    }
  );

  if (!result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Cannot edit user detail"));
  }

  sendToken(res, result);
}

module.exports = {
  getUserDetail,
  getAccountList,
  editUserDetail,
  userDetailResponse,
};
