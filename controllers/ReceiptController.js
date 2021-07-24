const { Receipt } = require('../database/ReceiptModel');
const { Product } = require('../database/ProductModel');
const { ReceiptDetail } = require('../database/ReceiptDetailModel');
const { ReceiptType } = require('../database/ReceiptTypeModel');
const mongoose = require('mongoose');
const { validateReceipt } = require('../validators/ReceiptValidator');
const { successResponse, errorResponse } = require('../models/ResponseAPI');

async function reduceStock(productList) {
  const session = await Product.startSession();
  await session.startTransaction();
  try {
    for (const index in productList) {
      const productInDB = await Product.findOne({
        _id: productList[index].id_product,
      });
      productInDB.stock =
        parseInt(productInDB.stock) - parseInt(productList[index].quantity);
      const result = await productInDB.save();
      if (!result) throw err('Cannot reduce stock');
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
    const tempProduct = temp.find((item) => item.id_product);

    if (!tempProduct) temp.push(product);
    else {
      const indTemp = temp.indexOf(tempProduct);
      const tempProd = temp[indTemp];
      if (
        tempProduct.price !== tempProd.price ||
        tempProduct.discount !== tempProd.discount ||
        (tempProduct.price !== tempProd.price &&
          tempProduct.discount !== tempProd.discount)
      )
        return null;
      temp[indTemp].quantity =
        parseInt(temp[indTemp].quantity) + parseInt(product.quantity);
    }
  }
  console.log(temp);
  return temp;
}

//User
async function getReceiptList(req, res, next) {
  const receiptList = await Receipt.find({ email: req.user.email });
  if (!receiptList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot get receipt list'));
  } else if (receiptList.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Receipt list is currently empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', receiptList));
}

async function getReceiptDetail(req, res, next) {
  const id = checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt id'));
  }

  //TH check ma receipt nguoi khac
  const receiptAuthCheck = await Receipt.findOne({
    _id: id,
    email: req.user.email,
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

  const session = await mongoose.startSession();
  await session.startTransaction();
  try {
    //Check duplicate product trong productlist
    const listCheck = checkDuplicate(receipt.productList);
    if (!listCheck) throw new err('List not right');
    receipt.productList = listCheck;

    const check = await checkStock(receipt.productList);
    if (!check) throw new err('Product not available or not enough stock');

    const reduce = await reduceStock(receipt.productList);
    if (!reduce) throw new err('Cannot get stock to receipt');

    const receiptType = await ReceiptType.findOne({
      _id: receipt_id_receipType,
    });

    if (!receiptType) {
      return res
        .status(400)
        .json(errorResponse(res.statusCode, 'Receipt type not exist'));
    }

    const dbReceipt = new Receipt({
      date: date,
      total: receipt.total,
      email: req.user.email,
      id_receiptType: id,
    });

    for (const index in receipt.productList) {
      let receiptDetail = new ReceiptDetail({
        id_receipt: dbReceipt._id,
        id_product: receipt.productList[index].id_product,
        price: receipt.productList[index].price,
        discount: receipt.productList[index].discount,
        quantity: receipt.productList[index].quantity,
      });
      const saveDetail = await receiptDetail.save();
      if (!saveDetail) {
        throw new err('Cannot save receipt detail');
      }
    }

    const saveReceipt = await dbReceipt.save();
    if (!saveReceipt) {
      throw new err('Failed to save receipt');
    }
    await session.commitTransaction();
    await session.endSession();
    return res.status(200).json(successResponse(res.statusCode, 'OK'));
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).json(errorResponse(res.statusCode, err));
  }
}

async function addReceipt(req, res, next) {
  const validateResult = validateReceipt(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt detail is incorrect'));
  }

  const receipt = {
    productList: req.body.productList,
    total: req.body.total,
    id_receiptType: req.body.id_receiptType,
  };

  return await saveReceipt(receipt, req, res);
}

//Admin
async function getReceiptListAdmin(req, res, next) {
  const receiptList = await Receipt.find({});
  if (!receiptList) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt list is empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', receiptList));
}

async function getReceiptDetailAdmin(req, res, next) {
  const id = checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt id'));
  }

  const receiptDetail = await ReceiptDetail.find({ id_receipt: id });
  if (!receiptDetail) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot get receipt detail'));
  } else if (receiptDetail.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Receipt detail is empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', receiptDetail));
}

async function changeReceiptType(req, res, next) {
  const id = checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt id'));
  }

  const idType = checkID(req.body.id_receiptType);
  if (!idType) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid receipt id'));
  }

  const typeIDCheck = ReceiptType.findOne({ _id: idType });
  if (!typeIDCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Receipt type not exist'));
  }

  const result = Receipt.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        id_receiptType: idType,
      },
    }
  );

  if (!result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot change receipt status'));
  }

  res
    .status(200)
    .json(
      successResponse(
        res.statusCode,
        'Change receipt status successful',
        result
      )
    );
}

module.exports = {
  getReceiptList,
  getReceiptDetail,
  addReceipt,
  getReceiptListAdmin,
  getReceiptDetailAdmin,
  changeReceiptType,
};
