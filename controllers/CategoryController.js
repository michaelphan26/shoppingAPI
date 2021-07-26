const { Category } = require('../database/CategoryModel');
const { Product } = require('../database/ProductModel');
const mongoose = require('mongoose');
const { errorResponse, successResponse } = require('../models/ResponseAPI');
const { validateCategory } = require('../validators/CategoryValidator');
const { checkID } = require('./CommonController');

async function getCategoryList(req, res, next) {
  const categoryList = await Category.find({});

  if (!categoryList) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot get category list'));
  } else if (categoryList.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Category list currently empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'Ok', categoryList));
}

async function addCategory(req, res, next) {
  const validateName = validateCategory(req.body);

  if (validateName.error) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, validateName.error.message));
  }

  reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const checkInDb = await Category.findOne({
    name: reg,
  });

  if (checkInDb) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Category name existed'));
  }

  const category = new Category({
    name: req.body.name.trim(),
  });

  const result = await category.save();
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot save category'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', category));
}

async function editCategory(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid category id'));
  }

  const validateResult = validateCategory(req.body);
  if (validateResult.error) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  const result = await Category.findOneAndUpdate(
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
      .status(404)
      .json(
        errorResponse(
          res.statusCode,
          'Cannot edit category or category not existed'
        )
      );
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', result));
}

async function deleteCategory(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid category id'));
  }

  const dbCheck = await Product.findOne({ id_category: id });
  if (dbCheck) {
    return res
      .status(400)
      .errorResponse(res.statusCode, 'Cannot delete this category');
  }

  const result = await Category.findOneAndDelete({ _id: id });
  if (!result) {
    return res
      .status(500)
      .json(
        errorResponse(
          res.statusCode,
          'Cannot delete this category or category not exist'
        )
      );
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok'));
}

module.exports = { getCategoryList, addCategory, editCategory, deleteCategory };
