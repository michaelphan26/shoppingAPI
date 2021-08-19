const express = require('express');
const {
  getIOTypeList,
  addIOType,
  editIOType,
  deleteIOType,
} = require('../controllers/IOTypeController');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/get-list', adminAuth, getIOTypeList);

module.exports = router;
