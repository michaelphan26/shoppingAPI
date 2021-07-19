const { Receipt } = require("../database/ReceiptModel");
const { Product } = require("../database/ProductModel");
const mongoose = require("mongoose");
const { validateReceipt } = require("../validators/ReceiptValidator");
const { successResponse, errorResponse } = require("../models/ResponseAPI");

async function reduceStock(productList) {
  const session = await Product.startSession();
  await session.startTransaction();
  try {
    for (const index in productList) {
      const productInDB = await Product.findOne({
        _id: productList[index].product._id,
      });
      productInDB.stock -= productList[index].quantity;
      const result = await productInDB.save();
      if (!result) throw err;
    }
    await session.commitTransaction();
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    return false;
  }

  return true;
}

async function checkStock(productList) {
  for (const index in productList) {
    const productInDB = await Product.findOne({
      _id: productList[index].product._id,
    });
    if (!productInDB || productInDB.stock < productList[index].quantity)
      return false;
  }
  return true;
}

//User
async function getReceiptList(req, res, next) {
  const receiptList = await Receipt.find({ email: req.user.email });
  if (!receiptList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Cannot get receipt list"));
  } else if (receiptList.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Product list currently empty"));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, "OK", receiptList));
}

async function getReceiptDetail(req, res, next) {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const receiptDetail = await Receipt.findOne({ _id: id });
  if (!receiptDetail) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Cannot get receipt detail"));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, "OK", receiptDetail));
}

async function saveReceipt(receipt, res) {
  const date = new Date().toLocaleDateString("en-GB");
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    const check = await checkStock(receipt.productList);
    if (!check)
      return res
        .status(400)
        .json(
          errorResponse(
            res.statusCode,
            "Product not available or not enough stock"
          )
        );

    const reduce = await reduceStock(receipt.productList);
    if (!reduce)
      return status(500).json(
        errorResponse(res.statusCode, "Cannot get stock to receipt")
      );

    const dbReceipt = new Receipt({
      productList: receipt.productList,
      date: date,
      total: receipt.total,
      email: req.user.email,
      status: false,
    });
    const result = dbReceipt.save();
    if (!result) {
      return res
        .status(500)
        .json(errorResponse(res.statusCode, "Failed to save receipt"));
    }
    await session.commitTransaction();
    await session.endSession();
    return res
      .status(200)
      .json(successResponse(res.statusCode, "OK", dbReceipt));
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).json("Failed to save receipt");
  }
}

async function addReceipt(req, res, next) {
  const receipt = {
    productList: req.body.productList,
    total: req.body.total,
  };

  const validateResult = validateReceipt(receipt);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Receipt detail is incorrect"));
  }

  return saveReceipt(receipt, res);
}

//Admin
async function getFullReceiptList(req, res, next) {
  const receiptList = await Receipt.find({});
  if (!receiptList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Receipt list is empty"));
  }

  return res.status(200).json(res.statusCode, "OK", receiptList);
}

async function toggleReceipt(req, res, next) {
  const id = mongoose.Types.ObjectId(req.params.id);
  const result = await Receipt.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: true,
      },
    }
  );

  if (!result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Cannot change receipt status"));
  }

  res
    .status(200)
    .json(successResponse(res.statusCode, "Change receipt status successful"));
}

module.exports = {
  getReceiptList,
  getReceiptDetail,
  addReceipt,
  getFullReceiptList,
  toggleReceipt,
};
