const express = require("express");
const router = express.Router();
const {
  authLogin,
  authRegister,
  authLogout,
} = require("../controllers/AuthController");
const { auth } = require("../middlewares/AuthMiddleware");
require("express-async-errors");

router.post("/login", authLogin);

router.post("/register", authRegister);

// router.put('/change-password', auth, )

router.post("/logout", auth, authLogout);

module.exports = router;
