const express = require('express');
const {
  getReceiptTypeList,
  addReceiptType,
  editReceiptType,
  deleteReceiptType,
} = require('../controllers/ReceiptTypeController');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/get-list', getReceiptTypeList);

router.post('/add-receipt-type', adminAuth, addReceiptType);

router.put('/edit-receipt-type/:id', adminAuth, editReceiptType);

router.delete('/delete-receipt-type/:id', adminAuth, deleteReceiptType);

module.exports = router;
