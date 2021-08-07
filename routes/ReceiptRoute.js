const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/AuthMiddleware');
const {
  getReceiptList,
  getReceiptDetail,
  addReceipt,
  checkoutReceipt,
  getCartOnLogin,
} = require('../controllers/ReceiptController');

router.get('/receipt-list', auth, getReceiptList);

router.get('/receipt-detail/:id', auth, getReceiptDetail);

router.post('/add-receipt', auth, addReceipt);

router.post('/receipt-checkout', auth, checkoutReceipt);

router.get('/get-cart', auth, getCartOnLogin);

module.exports = router;
