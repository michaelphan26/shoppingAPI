const express=require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');
const { addProduct, getProductList, getProductDetail, deleteProduct, editProduct } = require('../controllers/ProductController');
const { getAccountList, getUserDetail } = require('../controllers/UserController');
const { getFullReceiptList, getReceiptDetail } = require('../controllers/ReceiptController');

router.get('/account-list', adminAuth, getAccountList)

router.get('/account-detail', adminAuth, getUserDetail)

// router.post('/add-account');

// router.put('/edit-account');

router.get('/product-list', adminAuth, getProductList);

router.get('/product-detail/:id', adminAuth, getProductDetail);

router.post('/add-product', adminAuth, addProduct)

router.put('/edit-product/:id', adminAuth, editProduct);

router.delete('/delete-product/:id', adminAuth, deleteProduct);

router.get('/receipt-list', adminAuth, getFullReceiptList);

router.get('/receipt-detail/:id', adminAuth, getReceiptDetail);

// router.put('/edit-receipt');



module.exports=router