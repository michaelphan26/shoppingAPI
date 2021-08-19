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

module.exports = router;
