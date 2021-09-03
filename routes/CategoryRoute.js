const express = require('express');
const router = express.Router();
const {
  getCategoryList,
  getProductListByCategory,
  getCategoryName,
} = require('../controllers/CategoryController');

router.get('/category-list', getCategoryList);

router.get('/get-product-list/:id', getProductListByCategory);

router.get('/get-name/:id', getCategoryName);

module.exports = router;
