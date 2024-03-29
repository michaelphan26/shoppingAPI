const { Role } = require('../database/RoleModel');
const mongoose = require('mongoose');
const { successResponse, errorResponse } = require('../models/ResponseAPI');
const { validateRole } = require('../validators/RoleValidator');
const { User } = require('../database/UserModel');
const { checkID } = require('./CommonController');

async function getRoleList(req, res, next) {
  const roleList = await Role.find({});

  if (!roleList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get role list'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', roleList));
}

async function addRole(req, res, next) {
  const validateName = validateRole(req.body);

  if (validateName.error) {
    console.log(validateName);
    return res.status(404).json(validateName.error.message);
  }

  const reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const nameCheck = await Role.findOne({ name: reg });
  if (nameCheck) {
    return res.status(400).json(errorResponse(res.statusCode, 'Role existed'));
  }

  const role = new Role({
    name: req.body.name.trim(),
  });

  const result = await role.save();
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot save role'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', role));
}

async function editRole(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid role id'));
  }

  const validateResult = validateRole(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const checkInDb = await Role.find({
    name: reg,
  });
  if (checkInDb) {
    for (index in checkInDb) {
      if (String(checkInDb[index]._id) !== String(id)) {
        return res
          .status(400)
          .json(errorResponse(res.statusCode, 'Role name existed'));
      }
    }
  }

  const result = await Role.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name.trim(),
      },
    },
    { new: true }
  );

  if (!result) {
    return res
      .status(500)
      .json(
        errorResponse(res.statusCode, 'Cannot edit role or role not exist')
      );
  }
  console.log(result);

  return res.status(200).json(successResponse(res.statusCode, 'Ok', result));
}

async function deleteRole(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid role id'));
  }

  const dbCheck = await User.findOne({ id_role: id });
  if (dbCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot delete this role'));
  }

  const result = await Role.findOneAndDelete({ _id: id });
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot delete role'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok'));
}

async function getRoleInfo(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid role id'));
  }

  const dbCheck = await Role.findOne({ _id: id });
  if (!dbCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Role not existed'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', dbCheck));
}

module.exports = { getRoleList, addRole, editRole, deleteRole, getRoleInfo };
