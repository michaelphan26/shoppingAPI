const { Receipt } = require('../database/ReceiptModel');
const { Product } = require('../database/ProductModel');
const { ReceiptDetail } = require('../database/ReceiptDetailModel');
const { ReceiptType } = require('../database/ReceiptTypeModel');
const mongoose = require('mongoose');
const {
  validateReceipt,
  validateReceiptDateRange,
} = require('../validators/ReceiptValidator');
const { successResponse, errorResponse } = require('../models/ResponseAPI');
const { checkID } = require('./CommonController');
const _ = require('lodash');

// async function increaseStock(detailList) {
//   console.log('increase');
//   for (const index in detailList) {
//     const detail = detailList[index];
//     const result = await Product.findOneAndUpdate(
//       { _id: detail.id_product },
//       {
//         $inc: {
//           stock: detail.quantity,
//         },
//       },
//       { new: true }
//     );
//     if (!result) {
//       return false;
//     }
//   }

//   return true;
// }

async function reduceStock(productList, session) {
  try {
    for (const index in productList) {
      const productInDB = await Product.findOne({
        _id: productList[index].id_product,
      });
      productInDB.stock =
        parseInt(productInDB.stock) - parseInt(productList[index].quantity);
      const result = await productInDB.save({ session });
      if (!result) throw err('Cannot reduce stock');
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function checkStock(productList) {
  for (const index in productList) {
    const productInDB = await Product.findOne({
      _id: productList[index].id_product,
    });
    if (!productInDB || productInDB.stock < productList[index].quantity)
      return false;
  }
  return true;
}

async function checkDuplicate(productList) {
  let temp = [];
  for (const index in productList) {
    const product = productList[index];
    const tempProduct = temp.find(
      (item) => item.id_product === product.id_product
    );

    if (!tempProduct) temp.push(product);
    else {
      const indTemp = temp.indexOf(tempProduct);
      // const tempProd = temp[indTemp];
      // if (
      //   tempProduct.price !== tempProd.price ||
      //   tempProduct.discount !== tempProd.discount ||
      //   (tempProduct.price !== tempProd.price &&
      //     tempProduct.discount !== tempProd.discount)
      // )
      //   return null;
      temp[indTemp].quantity =
        parseInt(temp[indTemp].quantity) + parseInt(product.quantity);
    }
  }
  return temp;
}

//User
async function getReceiptList(req, res, next) {
  let id_receiptType;
  const check1 = await ReceiptType.findOne({ name: /^checkout$/i });
  if (!check1) {
    const check2 = await ReceiptType.findOne({ name: /^xac nhan$/i });
    if (!check2) {
      const check3 = await ReceiptType.findOne({ name: /^xác nhận$/i });
      if (!check3) {
        return res
          .status(400)
          .json(errorResponse(res.statusCode, 'Cannot get receipt type'));
      } else id_receiptType = check3._id;
    } else id_receiptType = check2._id;
  } else id_receiptType = check1._id;

  const user_id = await checkID(req.user._id);
  if (!user_id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid user id'));
  }

  const receiptList = await Receipt.find(
    { id_user: user_id, id_receiptType: id_receiptType },
    { _v: 0 }
  ).sort({ date: -1 });
  if (!receiptList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get receipt list'));
  } else if (receiptList.length === 0) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt list is currently empty'));
  }

  for (const index in receiptList) {
    const receiptObj = receiptList[index].toObject();
    receiptObj.date = new Date(receiptObj.date).toLocaleString('en-GB');
    receiptList[index] = receiptObj;
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', receiptList));
}

async function getReceiptDetail(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt id'));
  }

  //TH check ma receipt nguoi khac
  const receiptAuthCheck = await Receipt.findOne({
    _id: id,
    id_user: req.user._id,
  });
  if (!receiptAuthCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "You don't have this receipt"));
  }

  const receiptDetail = await ReceiptDetail.find({ id_receipt: id });
  if (!receiptDetail) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get receipt detail'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', receiptDetail));
}

async function saveReceipt(receipt, req, res) {
  const date = new Date();
  const receiptType = await ReceiptType.findOne({
    _id: receipt.id_receiptType,
  });

  if (!receiptType) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt type not exist'));
  }

  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    //Check duplicate product trong productlist
    const listCheck = await checkDuplicate(receipt.productList);
    if (!listCheck) throw new Error('List not right');
    receipt.productList = listCheck;

    //Check coi co dang co cart ko
    let add = false;
    let dbReceipt;
    const cartCheck = await Receipt.findOne({
      id_user: req.user._id,
      id_receiptType: receipt.id_receiptType,
    });

    if (!cartCheck) {
      console.log('New');
      dbReceipt = new Receipt({
        date: date,
        total: receipt.total,
        id_user: req.user._id,
        id_receiptType: receipt.id_receiptType,
      });
      add = true;
    } else {
      dbReceipt = cartCheck;
      console.log('Modify');
      // console.log('Check detail list');
      // if (detailList) {
      //   const increase = await increaseStock(detailList);
      //   console.log(increase);
      //   if (!increase) throw new Error('Cannot edit receipt detail');
      // }

      const check = await checkStock(receipt.productList);
      if (!check) throw new Error('Product not available or not enough stock');

      const deleteOldDetail = await ReceiptDetail.deleteMany({
        id_receipt: dbReceipt._id,
      }).session(session);
      if (!deleteOldDetail) {
        throw new Error('Cannot edit receipt detail');
      }
    }

    // const reduce = await reduceStock(receipt.productList, session);
    // console.log(reduce);
    // if (!reduce) throw new Error('Cannot get stock to receipt');

    console.log('detail');
    for (const index in receipt.productList) {
      const receiptDetail = new ReceiptDetail({
        id_receipt: dbReceipt._id,
        id_product: receipt.productList[index].id_product,
        price: receipt.productList[index].price,
        discount: receipt.productList[index].discount,
        quantity: receipt.productList[index].quantity,
      });
      const saveDetail = await receiptDetail.save({ session });
      if (!saveDetail) {
        throw new Error('Cannot save receipt detail');
      }
    }
    console.log('save');

    let saveReceipt;
    if (add) {
      console.log('add');
      saveReceipt = await dbReceipt.save({ session });
    } else {
      console.log('edit');
      saveReceipt = await Receipt.findOneAndUpdate(
        { _id: cartCheck._id },
        {
          $set: {
            total: req.body.total,
            date: date,
          },
        },
        { new: true }
      ).session(session);
    }

    if (!saveReceipt) {
      throw new Error('Failed to save receipt');
    }
    console.log('OK');
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json(successResponse(res.statusCode, 'OK'));
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).json(errorResponse(res.statusCode, err.message));
  }
}

async function addReceipt(req, res, next) {
  const validateResult = validateReceipt(req.body);
  if (validateResult.error) {
    console.log(validateResult.error.message);
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  let id_receiptType;
  const check1 = await ReceiptType.findOne({ name: /^cart$/i });
  if (!check1) {
    const check2 = await ReceiptType.findOne({ name: /^gio hang$/i });
    if (!check2) {
      const check3 = await ReceiptType.findOne({ name: /^giỏ hàng$/i });
      if (!check3) {
        return res
          .status(400)
          .json(errorResponse(res.statusCode, 'Cannot get receipt type'));
      } else id_receiptType = check3._id;
    } else id_receiptType = check2._id;
  } else id_receiptType = check1._id;

  const receipt = {
    productList: req.body.productList,
    total: req.body.total,
    id_receiptType: id_receiptType,
  };

  console.log('Saving');
  return await saveReceipt(receipt, req, res);
}

//Admin
async function getReceiptListAdmin(req, res, next) {
  const receiptList = await Receipt.find({}).sort({ date: -1 });
  if (!receiptList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt list is empty'));
  }

  for (const index in receiptList) {
    const receiptObj = receiptList[index].toObject();
    receiptObj.date = new Date(receiptObj.date).toLocaleString('en-GB');
    receiptList[index] = receiptObj;
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', receiptList));
}

async function getReceiptDetailAdmin(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt id'));
  }

  const receiptDetail = await ReceiptDetail.find({ id_receipt: id });
  if (!receiptDetail) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get receipt detail'));
  } else if (receiptDetail.length === 0) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt detail is empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', receiptDetail));
}

async function changeReceiptType(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt id'));
  }

  const idCheck = await Receipt.findOne({ _id: id });
  if (!idCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt not existed'));
  }

  const idType = await checkID(req.body.id_receiptType);
  if (!idType) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt id not exist'));
  }

  const typeIDCheck = await ReceiptType.findOne({ _id: idType });
  if (!typeIDCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt type not exist'));
  }

  const result = await Receipt.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        id_receiptType: idType,
      },
    },
    { new: true }
  );

  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot change receipt status'));
  }

  return res
    .status(200)
    .json(
      successResponse(
        res.statusCode,
        'Change receipt status successful',
        result
      )
    );
}

async function getCartID(req) {
  let id_receiptType;
  const check1 = await ReceiptType.findOne({ name: /^cart$/i });
  if (!check1) {
    const check2 = await ReceiptType.findOne({ name: /^gio hang$/i });
    if (!check2) {
      const check3 = await ReceiptType.findOne({ name: /^giỏ hàng$/i });
      if (!check3) {
        return null;
      } else id_receiptType = check3._id;
    } else id_receiptType = check2._id;
  } else id_receiptType = check1._id;

  const dbCheck = await Receipt.findOne({
    id_receiptType: id_receiptType,
    id_user: req.user._id,
  });
  if (!dbCheck) {
    return null;
  }

  return dbCheck._id;
}

async function checkoutReceipt(req, res, next) {
  const id = await getCartID(req);
  if (id === null) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'You dont have any cart'));
  }

  const receipt = await Receipt.findOne({ _id: id });

  if (receipt.total <= 1000) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Receipt total not valid'));
  }

  let id_receiptType;
  const check1 = await ReceiptType.findOne({ name: /^checkout$/i });
  if (!check1) {
    const check2 = await ReceiptType.findOne({ name: /^xac nhan$/i });
    if (!check2) {
      const check3 = await ReceiptType.findOne({ name: /^xác nhận$/i });
      if (!check3) {
        return res
          .status(400)
          .json(errorResponse(res.statusCode, 'Cannot get receipt type'));
      } else id_receiptType = check3._id;
    } else id_receiptType = check2._id;
  } else id_receiptType = check1._id;

  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    console.log(id);
    const receiptDetailList = await ReceiptDetail.find({ id_receipt: id });

    if (!receiptDetailList || receiptDetailList.length === 0)
      throw new Error('Receipt detail is empty');

    console.log('CheckStock');
    const check = await checkStock(receipt.productList);
    if (!check) throw new Error('Product not available or not enough stock');

    console.log('ReduceStock');
    const reduce = await reduceStock(receiptDetailList, session);
    if (!reduce) throw new Error('Cannot reduce stock');

    console.log('UpdateReceipt');
    const result = await Receipt.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          id_receiptType: id_receiptType,
        },
      },
      { new: true }
    ).session(session);

    if (!result) throw new Error('Cannot checkout');
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json(successResponse(res.statusCode, 'Ok', result));
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).json(errorResponse(res.statusCode, err.message));
  }
}

async function getReceiptListNoResponse(req) {
  const receiptList = await Receipt.find({ id_user: req.user._id });
  if (!receiptList) {
    return null;
  } else if (receiptList.length === 0) {
    return null;
  }
  for (const index in receiptList) {
    const receiptObj = receiptList[index].toObject();
    receiptObj.date = new Date(receiptObj.date).toLocaleString('en-GB');
    receiptList[index] = receiptObj;
  }

  return receiptList;
}

async function getCartOnLogin(req, res, next) {
  const receiptList = await getReceiptListNoResponse(req);
  if (receiptList === null) return;
  let cart;
  for (const index in receiptList) {
    const id_receiptType = receiptList[index].id_receiptType;
    const receipt = await ReceiptType.findOne({ _id: id_receiptType });
    if (
      receipt &&
      (receipt.name.toLowerCase() === 'cart' ||
        receipt.name.toLowerCase() === 'gio hang' ||
        receipt.name.toLowerCase() === 'giỏ hàng')
    ) {
      cart = receiptList[index];
      break;
    }
  }
  if (!cart) {
    return res.status(400).json(errorResponse(res.statusCode, 'No cart exist'));
  }

  const receiptDetail = await ReceiptDetail.find(
    { id_receipt: cart._id },
    { _id: 0, id_receipt: 0, __v: 0 }
  );
  if (!receiptDetail) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'No detail exist'));
  }

  return res.status(200).json(
    successResponse(res.statusCode, 'Ok', {
      productList: receiptDetail,
      total: cart.total,
    })
  );
}

async function getReceiptFromDate(req, res, next) {
  const validateResult = validateReceiptDateRange(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  let id_receiptType;
  const check1 = await ReceiptType.findOne({ name: /^checkout$/i });
  if (!check1) {
    const check2 = await ReceiptType.findOne({ name: /^xac nhan$/i });
    if (!check2) {
      const check3 = await ReceiptType.findOne({ name: /^xác nhận$/i });
      if (!check3) {
        return res
          .status(400)
          .json(errorResponse(res.statusCode, 'Cannot get receipt type'));
      } else id_receiptType = check3._id;
    } else id_receiptType = check2._id;
  } else id_receiptType = check1._id;

  const dateFrom = new Date(req.body.dateFrom.trim());
  let dateTo = new Date(req.body.dateTo.trim());
  dateTo.setDate(dateTo.getDate() + 1);
  const dbData = await Receipt.find({
    date: { $gte: dateFrom, $lte: dateTo },
    id_receiptType: id_receiptType,
  });
  if (!dbData) {
    return res
      .statusCode(400)
      .json(errorResponse(res.statusCode, 'Cannot get data'));
  }

  for (const index in dbData) {
    const receiptObj = dbData[index].toObject();
    receiptObj.date = new Date(receiptObj.date).toLocaleString('en-GB');
    dbData[index] = receiptObj;
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', dbData));
}

module.exports = {
  getReceiptList,
  getReceiptDetail,
  addReceipt,
  getReceiptListAdmin,
  getReceiptDetailAdmin,
  changeReceiptType,
  checkoutReceipt,
  getCartOnLogin,
  getReceiptFromDate,
};
