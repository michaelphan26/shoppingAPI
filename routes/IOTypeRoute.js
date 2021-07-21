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

router.post('/add-io-type', adminAuth, addIOType);

router.put('/edit-io-type/:id', adminAuth, editIOType);

router.delete('/delete-io-type/:id', adminAuth, deleteIOType);

module.exports = router;
