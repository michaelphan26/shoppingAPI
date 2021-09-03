const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');
const { getIOList } = require('../controllers/IOController');

router.get('/io-list', adminAuth, getIOList);

module.exports = router;
