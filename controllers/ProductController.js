const { Product } = require('../database/ProductModel');
const mongoose = require('mongoose');
const { validateProduct } = require('../validators/ProductValidator');
const _ = require('lodash');
const { successResponse, errorResponse } = require('../models/ResponseAPI');
const isBase64 = require('is-base64');
const { ReceiptDetail } = require('../database/ReceiptDetailModel');

function productDetailResponse(product) {
  return _.omit(product.toObject(), ['__v']);
}

//User
async function getProductList(req, res, next) {
  const productList = await Product.find({ status: true });
  if (!productList) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot get product list'));
  } else if (productList.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Product list currently empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', productList));
}

async function getProductDetail(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid product id'));
  }

  const product = await Product.findOne({ _id: id, status: true });
  if (!product) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot get product detail'));
  }

  return res
    .status(200)
    .json(
      successResponse(res.statusCode, 'OK', productDetailResponse(product))
    );
}

//Admin
async function getProductListAdmin(req, res, next) {
  const productList = await Product.find({});
  if (!productList) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot get product list'));
  } else if (productList.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Product list currently empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'OK', productList));
}

async function getProductDetailAdmin(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid product id'));
  }

  const product = await Product.findOne({ _id: id });
  if (!product) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot get product detail'));
  }

  return res
    .status(200)
    .json(
      successResponse(res.statusCode, 'OK', productDetailResponse(product))
    );
}

async function addProduct(req, res, next) {
  const checkImage = isBase64(req.body.image.trim(), {
    allowMime: false,
    allowEmpty: true,
  });
  if (!checkImage) {
    return res
      .status(400)
      .json(
        errorResponse(
          res.statusCode,
          'Image error. Image empty or forgot to remove mime'
        )
      );
  }

  const validateResult = validateProduct(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const dbProduct = new Product({
    name: req.body.name.trim(),
    brand: req.body.brand.trim(),
    price: req.body.price.trim(),
    description: req.body.description.trim(),
    stock: req.body.stock.trim(),
    discount: req.body.discount.trim(),
    status: req.body.status,
    image: req.body.image.trim(),
    id_category: req.body.id_category.trim(),
  });

  const result = await dbProduct.save();
  if (!result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Failed to add product'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'Add product successful'));
}

async function deleteProduct(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid product id'));
  }

  const ioCheck = await IOProductDetail.findOne({ id_IOProduct: id });
  const receiptCheck = await ReceiptDetail.findOne({ id_product: id });
  if (ioCheck || receiptCheck || (ioCheck && receiptCheck)) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot delete this product'));
  }

  const result = await Product.findByIdAndDelete({ _id: id });
  if (result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Failed to delete product'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'Delete product successful'));
}

async function editProduct(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid product id'));
  }

  const checkImage = isBase64(req.body.image.trim(), {
    allowMime: false,
    allowEmpty: true,
  });
  if (!checkImage) {
    return res
      .status(400)
      .json(
        errorResponse(
          res.statusCode,
          'Image error. Image empty or forgot to remove mime'
        )
      );
  }

  const validateResult = validateProduct(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const result = await Product.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name.trim(),
        brand: req.body.brand.trim(),
        price: req.body.price,
        description: req.body.description.trim(),
        stock: req.body.stock,
        discount: req.body.discount,
        status: req.body.status,
        image: req.body.image.trim(),
        id_category: req.body.id_category.trim(),
      },
    }
  );
  if (!result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Failed to edit product'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'Edit product successful'));
}

module.exports = {
  getProductList,
  getProductDetail,
  addProduct,
  deleteProduct,
  editProduct,
  getProductListAdmin,
  getProductDetailAdmin,
};
