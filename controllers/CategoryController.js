const { Category } = require('../database/CategoryModel');
const { Product } = require('../database/ProductModel');
const mongoose = require('mongoose');
const { errorResponse, successResponse } = require('../models/ResponseAPI');
const { validateCategory } = require('../validators/CategoryValidator');

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

  const checkInDb = await Category.findOne({
    name: req.body.name.trim(),
  });

  if (checkInDb) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Category existed'));
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
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid role id'));
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
    }
  );

  if (!result) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot edit category'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', null));
}

async function deleteCategory(req, res, next) {
  let id;
  try {
    id = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid category id'));
  }

  const dbCheck = await Product.findOne({ id_category: id });
  if (dbCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot delete this category'));
  }

  const result = await Category.findOneAndDelete({ _id: id });
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot delete this category'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', null));
}

module.exports = { getCategoryList, addCategory, editCategory, deleteCategory };
