const { Role } = require("../database/RoleModel");
const mongoose = require("mongoose");
const { successResponse, errorResponse } = require("../models/ResponseAPI");
const { validateRole } = require("../validators/RoleValidator");

async function getRoleList(req, res, next) {
  const roleList = await Role.find({});

  if (!roleList) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Cannot get role list"));
  }

  return res.status(200).json(successResponse(res.statusCode, "Ok", roleList));
}

async function addRole(req, res, next) {
  const validateName = validateRole(req.body);

  if (validateName.error) {
    return res.status(404).json(validateName.error.message);
  }

  const check = await Role.findOne({ name: req.body });
  if (check) {
    return res.status(404).json(errorResponse(res.statusCode, "Role existed"));
  }

  const role = new Role({
    name: req.body.trim(),
  });

  const result = await role.save();
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, "Cannot save role"));
  }

  return res.status(200).json(successResponse(res.statusCode, "Ok", role));
}

async function editRole(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Invalid role id"));
  }

  const validateResult = validateRole(req.body);
  if (validateResult.error) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const result = await Role.findOnefindOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.trim(),
      },
    }
  );

  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, "Cannot edit role"));
  }

  return res.status(200).json(successResponse(res.statusCode, "Ok", null));
}

module.exports = { getRoleList, addRole, editRole };
