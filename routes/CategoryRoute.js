const express = require('express');
const router = express.Router();
const {
  getCategoryList,
  addCategory,
  editCategory,
  deleteCategory,
  getProductListByCategory,
  getCategoryName,
} = require('../controllers/CategoryController');
const { auth, adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/category-list', getCategoryList);

router.get('/get-product-list/:id', getProductListByCategory);

router.get('/get-name/:id', getCategoryName);

module.exports = router;
