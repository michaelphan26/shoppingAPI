const mongoose = require('mongoose');
const { Receipt } = require('../database/ReceiptModel');
const { ReceiptType } = require('../database/ReceiptTypeModel');
const { errorResponse, successResponse } = require('../models/ResponseAPI');
const { validateReceiptType } = require('../validators/ReceiptTypeValidator');
const { checkID } = require('./CommonController');

async function getReceiptTypeList(req, res, next) {
  const typeList = await ReceiptType.find({});

  if (!typeList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get receipt type list'));
  } else if (typeList.length === 0) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt type list is empty'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', typeList));
}

async function addReceiptType(req, res, next) {
  const validateResult = validateReceiptType(req.body);

  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const nameCheck = await ReceiptType.findOne({ name: reg });
  if (nameCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt type existed'));
  }

  const dbType = new ReceiptType({
    name: req.body.name.trim(),
  });

  const result = await dbType.save();
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot save receipt type'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', dbType));
}

async function editReceiptType(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt type id'));
  }

  const validateResult = validateReceiptType(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const checkInDb = await ReceiptType.find({
    name: reg,
  });
  if (checkInDb) {
    for (index in checkInDb) {
      if (String(checkInDb[index]._id) !== String(id)) {
        return res
          .status(400)
          .json(errorResponse(res.statusCode, 'receipt type name existed'));
      }
    }
  }

  const result = await ReceiptType.findOneAndUpdate(
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
      .staus(500)
      .json(
        errorResponse(
          res.statusCode,
          'Cannot edit receipt type or receipt type not exist'
        )
      );
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', result));
}

async function deleteReceiptType(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt type id'));
  }

  const dbCheck = await Receipt.findOne({ id_receiptType: id });
  if (dbCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot delete this receipt type'));
  }

  const result = await ReceiptType.findOneAndDelete({ _id: id });
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot delete this receipt type'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok'));
}

async function getReceiptTypeByID(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt type id'));
  }

  const checkDB = await ReceiptType.findOne({ _id: id });
  if (!checkDB) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt type not existed'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', checkDB));
}

module.exports = {
  getReceiptTypeList,
  addReceiptType,
  editReceiptType,
  deleteReceiptType,
  getReceiptTypeByID,
};
