const express = require('express');
const router = express.Router();
const { getIODetail } = require('../controllers/IODetailController');
const { adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/:id', adminAuth, getIODetail);

module.exports = router;
