const express = require('express');
const router = express.Router();
const {
  getCategoryList,
  addCategory,
  editCategory,
  deleteCategory,
} = require('../controllers/CategoryController');
const { auth, adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/category-list', getCategoryList);

router.post('/add-category', adminAuth, addCategory);

router.delete('/delete-category/:id', adminAuth, deleteCategory);

router.put('/edit-category/:id', adminAuth, editCategory);

module.exports = router;
