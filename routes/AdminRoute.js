const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');
const {
  addProduct,
  getProductList,
  getProductDetail,
  deleteProduct,
  editProduct,
  getProductListAdmin,
  getProductDetailAdmin,
} = require('../controllers/ProductController');
const {
  getAccountList,
  getUserDetail,
  editUserDetailAdmin,
  adminAddUser,
} = require('../controllers/UserController');
const {
  getReceiptListAdmin,
  getReceiptDetail,
  getReceiptDetailAdmin,
  toggleReceipt,
} = require('../controllers/ReceiptController');

router.get('/account-list', adminAuth, getAccountList);

router.get('/account-detail/:id', adminAuth, getUserDetail);

router.post('/add-account', adminAuth, adminAddUser);

router.put('/edit-account/:id', adminAuth, editUserDetailAdmin);

router.get('/product-list', adminAuth, getProductListAdmin);

router.get('/product-detail/:id', adminAuth, getProductDetailAdmin);

// router.post('/add-product', adminAuth, addProduct);

// router.put('/edit-product/:id', adminAuth, editProduct);

// router.delete('/delete-product/:id', adminAuth, deleteProduct);

router.get('/receipt-list', adminAuth, getReceiptListAdmin);

router.get('/receipt-detail/:id', adminAuth, getReceiptDetailAdmin);

// router.put('/edit-receipt/:id', adminAuth, toggleReceipt);

module.exports = router;
