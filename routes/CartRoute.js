const express = require("express");
const {
  getCart,
  emptyCart,
  addToCart,
} = require("../controllers/CartController");
const router = express.Router();
const { auth } = require("../middlewares/AuthMiddleware");

router.get("/", auth, getCart);

router.post("/empty-cart", auth, emptyCart);

router.post("/add-to-cart", auth, addToCart);

// router.delete("/remove-from-cart", auth);

// router.put("/change-cart-quantity", auth);

module.exports = router;
