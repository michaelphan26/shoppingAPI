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
  editUserDetailAdmin,
  adminAddUser,
  getUser,
  getUserDetailByID,
} = require('../controllers/UserController');
const {
  getReceiptListAdmin,
  getReceiptDetailAdmin,
  changeReceiptType,
  getReceiptFromDate,
} = require('../controllers/ReceiptController');
const { getSummary } = require('../controllers/CommonController');
const {
  addCategory,
  editCategory,
  deleteCategory,
} = require('../controllers/CategoryController');
const {
  addCompany,
  editCompany,
  deleteCompany,
} = require('../controllers/CompanyController');
const { addIO } = require('../controllers/IOController');
const {
  addIOType,
  editIOType,
  deleteIOType,
  getIOTypeByID,
} = require('../controllers/IOTypeController');
const {
  addReceiptType,
  editReceiptType,
  deleteReceiptType,
  getReceiptTypeByID,
} = require('../controllers/ReceiptTypeController');
const {
  addRole,
  editRole,
  deleteRole,
} = require('../controllers/RoleController');

router.get('/account-list', adminAuth, getAccountList);

router.get('/account-detail/:id', adminAuth, getUserDetailByID);

router.post('/add-account', adminAuth, adminAddUser);

router.put('/edit-account/:id', adminAuth, editUserDetailAdmin);

router.get('/product-list', adminAuth, getProductListAdmin);

router.get('/product-detail/:id', adminAuth, getProductDetailAdmin);

router.post('/add-product', adminAuth, addProduct);

router.put('/edit-product/:id', adminAuth, editProduct);

router.delete('/delete-product/:id', adminAuth, deleteProduct);

router.get('/receipt-list', adminAuth, getReceiptListAdmin);

router.get('/receipt-detail/:id', adminAuth, getReceiptDetailAdmin);

router.put('/edit-receipt/:id', adminAuth, changeReceiptType);

router.post('/add-category', adminAuth, addCategory);

router.delete('/delete-category/:id', adminAuth, deleteCategory);

router.put('/edit-category/:id', adminAuth, editCategory);

router.post('/add-company', adminAuth, addCompany);

router.put('/edit-company/:id', adminAuth, editCompany);

router.delete('/delete-company/:id', adminAuth, deleteCompany);

router.post('/add-io', adminAuth, addIO);

router.post('/add-io-type', adminAuth, addIOType);

router.put('/edit-io-type/:id', adminAuth, editIOType);

router.delete('/delete-io-type/:id', adminAuth, deleteIOType);

router.get('/io-type/:id', adminAuth, getIOTypeByID);

router.post('/add-receipt-type', adminAuth, addReceiptType);

router.put('/edit-receipt-type/:id', adminAuth, editReceiptType);

router.delete('/delete-receipt-type/:id', adminAuth, deleteReceiptType);

router.get('/receipt-type/:id', adminAuth, getReceiptTypeByID);

router.post('/add-role', adminAuth, addRole);

router.delete('/delete-role/:id', adminAuth, deleteRole);

router.put('/edit-role/:id', adminAuth, editRole);

router.get('/summary', adminAuth, getSummary);

router.get('/account/:id', adminAuth, getUser);

router.post('/get-receipt-statistic', adminAuth, getReceiptFromDate);

module.exports = router;
