const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');
const { getIOList, addIO } = require('../controllers/IOController');

router.get('/io-list', adminAuth, getIOList);

router.post('/add-io', adminAuth, addIO);

module.exports = router;
