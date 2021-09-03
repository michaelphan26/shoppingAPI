const express = require('express');
const router = express.Router();
const {
  getUserDetail,
  editUserDetail,
  getUser,
} = require('../controllers/UserController');
const { auth, adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/me', auth, getUserDetail);

router.put('/edit-detail/:id', auth, editUserDetail);

module.exports = router;
