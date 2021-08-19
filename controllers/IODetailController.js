const mongoose = require('mongoose');
const { IOProductDetail } = require('../database/IOProductDetailModel');
const { errorResponse, successResponse } = require('../models/ResponseAPI');
const { checkID } = require('./CommonController');

async function getIODetail(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res.status(404).json(errorResponse(res.statusCode, 'Invalid io id'));
  }

  const ioDetailList = await IOProductDetail.find({ id_IOProduct: id });

  if (!ioDetailList) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot get io detail list'));
  } else if (ioDetailList.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'IO detail list currently empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'Ok', ioDetailList));
}

module.exports = { getIODetail };
