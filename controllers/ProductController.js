const { Product } = require("../database/ProductModel");
const mongoose = require("mongoose");
const { validateProduct } = require("../validators/ProductValidator");
const _ = require("lodash");
const { successResponse, errorResponse } = require("../models/ResponseAPI");

function productDetailResponse(product) {
  return _.omit(product.toObject(), ["__v"]);
}

//User
async function getProductList(req, res, next) {
  const productList = await Product.find({});
  if (!productList) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Cannot get product list"));
  } else if (productList.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Product list currently empty"));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, "OK", productList));
}

async function getProductDetail(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Invalid product id"));
  }

  const product = await Product.findOne({ _id: id });
  if (!product) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Cannot get product detail"));
  }

  return res
    .status(200)
    .json(
      successResponse(res.statusCode, "OK", productDetailResponse(product))
    );
}

//Admin
async function addProduct(req, res, next) {
  const product = {
    name: req.body.name.trim(),
    brand: req.body.brand.trim(),
    category: req.body.category.trim(),
    price: req.body.price,
    stock: req.body.stock,
    image: req.body.image.trim(),
  };

  const validateResult = validateProduct(product);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const dbProduct = new Product({
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    stock: product.stock,
    image: product.image,
  });
  const result = await dbProduct.save();
  if (!result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Failed to add product"));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, "Add product successful"));
}

async function deleteProduct(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Invalid product id"));
  }

  const result = await Product.findByIdAndRemove({ _id: id });
  if (result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, "Failed to delete product"));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, "Delete product successful"));
}

async function editProduct(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Invalid product id"));
  }

  const newDetail = {
    name: req.body.name.trim(),
    brand: req.body.brand.trim(),
    category: req.body.category.trim(),
    price: req.body.price,
    stock: req.body.stock,
    image: req.body.image.trim(),
  };

  const validateResult = validateProduct(newDetail);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validate.error.message));
  }

  const result = await Product.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: newDetail.name,
        brand: newDetail.brand,
        category: newDetail.category,
        price: newDetail.price,
        stock: newDetail.stock,
        image: newDetail.image,
      },
    }
  );
  if (!result) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode("Failed to edit product")));
  }

  return res
    .statusCode(200)
    .json(successResponse(res.statusCode, "Edit product successful"));
}

module.exports = {
  getProductList,
  getProductDetail,
  addProduct,
  deleteProduct,
  editProduct,
};
