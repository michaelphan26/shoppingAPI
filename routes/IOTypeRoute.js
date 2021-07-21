const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/AsyncMiddleware');

router.get('/io-type-list'.adminAuth);

router.post('/add-io-type', adminAuth);

router.put('/edit-io-type/:id', adminAuth);

router.delete('/delete-io-type/:id', adminAuth);

module.exports = router;
