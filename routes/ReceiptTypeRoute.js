const express = require('express');
const {
  getReceiptTypeList,
  addReceiptType,
} = require('../controllers/ReceiptTypeController');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/get-list', getReceiptTypeList);

router.post('/add-receipt-type', adminAuth, addReceiptType);

// router.put('/edit-receipt-type/:id', adminAuth);

// router.delete('/delete-receipt-type/:id', adminAuth);

module.exports = router;
