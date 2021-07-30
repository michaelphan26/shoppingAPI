const express = require('express');
const router = express.Router();
const {
  authLogin,
  authRegister,
  changePassword,
} = require('../controllers/AuthController');
const { auth } = require('../middlewares/AuthMiddleware');
require('express-async-errors');

router.post('/login', authLogin);

router.post('/register', authRegister);

router.post('/change-password', auth, changePassword);

module.exports = router;
