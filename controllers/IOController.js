const mongoose = require('mongoose');
const { IOProduct } = require('../database/IOProductModel');
const { IOProductDetail } = require('../database/IOProductDetailModel');
const { IOType } = require('../database/IOTypeModel');
const { errorResponse, successResponse } = require('../models/ResponseAPI');
const {
  validateIOProduct,
  validateStatisticDateRange,
} = require('../validators/IOProductValidator');
const { Product } = require('../database/ProductModel');
const { checkID } = require('./CommonController');

async function changeStock(io, type, session) {
  try {
    const date = new Date();
    const ioProduct = new IOProduct({
      date: date,
      id_ioType: io.id_ioType,
    });

    const saveIOProduct = await ioProduct.save({ session });
    if (!saveIOProduct) throw new Error('Cannot save IO product');

    //Check trùng
    let tempList = [];
    for (const index in io.productList) {
      const tempIndex = tempList.findIndex(
        (item) =>
          item.id_product === io.productList[index].id_product &&
          item.id_company === io.productList[index].company &&
          item.quantity === io.productList[index].quantity &&
          item.price === io.productList[index].price
      );

      if (tempIndex === -1) {
        tempList.push(io.productList[index]);
      } else {
        tempList[tempIndex].quantity =
          parseInt(tempList[tempIndex].quantity) +
          parseInt(io.productList[index].quantity);
      }
    }

    for (const index in tempList) {
      const productInDB = await Product.findOne({
        _id: tempList[index].id_product,
      });

      if (!productInDB) throw new Error('Product not available');
      if (type === 'increase') {
        productInDB.stock =
          parseInt(productInDB.stock) + parseInt(tempList[index].quantity);
      } else if (type === 'decrease') {
        if (productInDB.stock < tempList[index].quantity) {
          throw new Error('Not enough quantity');
        }
        productInDB.stock =
          parseInt(productInDB.stock) - parseInt(tempList[index].quantity);
      }

      const result = await productInDB.save({ session });
      if (!result) throw new Error('Cannot increase stock');

      const ioProductDetail = await new IOProductDetail({
        id_IOProduct: ioProduct._id,
        id_product: tempList[index].id_product,
        quantity: tempList[index].quantity,
        price: tempList[index].price,
        id_company: tempList[index].id_company,
      });

      const save = await ioProductDetail.save({ session });
      if (!save) throw new Error('Cannot save io detail');
    }
    return true;
  } catch (err) {
    return false;
  }
}

async function saveIO(io, res) {
  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    let result;
    if (
      io.name.toLowerCase() === 'import' ||
      io.name.toLowerCase() === 'nhập' ||
      io.name.toLowerCase() === 'nhap'
    ) {
      result = await changeStock(io, 'increase', session);
    } else if (
      io.name.toLowerCase() === 'export' ||
      io.name.toLowerCase() === 'xuất' ||
      io.name.toLowerCase() === 'xuat'
    ) {
      result = await changeStock(io, 'decrease', session);
    }

    if (result) {
      await session.commitTransaction();
      await session.endSession();
      res.status(200).json(successResponse(res.statusCode, 'Ok'));
    } else throw new Error();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    res.status(500).json(errorResponse(res.statusCode, 'Failed to save io'));
  }
}

async function getIOList(req, res, next) {
  const ioList = await IOProduct.find({}).sort({ date: -1 });

  if (!ioList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get io list'));
  } else if (ioList.length === 0) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'IO list currently empty'));
  }

  for (const index in ioList) {
    const ioObj = ioList[index].toObject();
    ioObj.date = new Date(ioObj.date).toLocaleString('en-GB');
    ioList[index] = ioObj;
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', ioList));
}

async function addIO(req, res, next) {
  const validateResult = validateIOProduct(req.body);

  if (validateResult.error) {
    console.log(validateResult.error.message);
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  console.log('Type check');
  const ioTypeCheck = await IOType.findOne({ _id: req.body.id_ioType });
  if (!ioTypeCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot find io type'));
  }

  const io = {
    id_ioType: req.body.id_ioType,
    name: ioTypeCheck.toObject().name,
    productList: req.body.productList,
  };
  console.log('Saving');

  return await saveIO(io, res);
}

module.exports = { getIOList, addIO };
