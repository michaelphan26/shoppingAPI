const mongoose = require('mongoose');
const { IOType } = require('../database/IOTypeModel');
const { IOProduct } = require('../database/IOProductModel');
const { validateIOType } = require('../validators/IOTypeValidator');
const { errorResponse, successResponse } = require('../models/ResponseAPI');
const { checkID } = require('./CommonController');

async function getIOTypeList(req, res, next) {
  const ioTypeList = await IOType.find({});

  if (!ioTypeList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get IO type list'));
  } else if (ioTypeList.length === 0) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'IO type list is empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'Ok', ioTypeList));
}

async function addIOType(req, res, next) {
  const validateResult = validateIOType(req.body);

  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const nameCheck = await IOType.findOne({ name: reg });
  if (nameCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'IO type name existed'));
  }

  const dbType = new IOType({
    name: req.body.name.trim(),
  });

  const result = await dbType.save();
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot add io type'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', dbType));
}

async function editIOType(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid io type id'));
  }

  const validateResult = validateIOType(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const checkInDb = await IOType.find({
    name: reg,
  });
  if (checkInDb) {
    for (index in checkInDb) {
      if (checkInDb[index]._id !== id) {
        return res
          .status(400)
          .json(errorResponse(res.statusCode, 'IO type name existed'));
      }
    }
  }

  const result = await IOType.findOneAndUpdate(
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
      .json(errorResponse(res.statusCode, 'Cannot edit io type'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok'));
}

async function deleteIOType(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid io type id'));
  }

  const checkDB = await IOProduct.findOne({ id_ioType: id });
  if (checkDB) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot delete this io type'));
  }

  const result = await IOType.findOneAndDelete({ _id: id });
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot delete this io type'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok'));
}

async function getIOTypeByID(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid io type id'));
  }

  const checkDB = await IOType.findOne({ _id: id });
  if (!checkDB) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'IO type not existed'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', checkDB));
}

module.exports = {
  getIOTypeList,
  addIOType,
  editIOType,
  deleteIOType,
  getIOTypeByID,
};
