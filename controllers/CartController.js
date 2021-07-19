const { Cart } = require("../database/CartModel");
const { Product } = require("../database/ProductModel");
const { successResponse, errorResponse } = require("../models/ResponseAPI");
const { validateProduct } = require("../validators/CartValidator");

async function getCart(req, res, next) {
  const email = req.user.email;
  const dbCart = await Cart.findOne({ email: email });

  if (!dbCart) {
    return res
      .status(200)
      .json(successResponse(res.statusCode, "Cart empty", null));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, "Cart OK", dbCart));
}

async function emptyCart(req, res, next) {
  const email = req.user.email;
  const dbCart = await Cart.findOneAndRemove({ email: email });

  if (!dbCart) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, "Delete current cart failed"));
  }

  return res.status(200).json(successResponse(res.statusCode, "Ok", null));
}

async function addToCart(req, res, next) {
  const email = req.user.email;

  const validateBody = validateProduct(req.body);
  if (validateBody.error) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, check.error.message));
  }

  const checkInDB = Product.findOne({ _id: req.body.productID });
  if (!checkInDB) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, "Product not available"));
  }

  const dbCart = await Cart.finOne({ email: email });

  //Cart empty
  if (!dbCart) {
    const date = new Date().toLocaleString("en-GB");
    const cart = new Cart({
      productList: [],
      email: req.user.email,
      date: date,
      total: 0,
    });

    cart.productList = cart.productList.push({
      productID: req.body.productID,
      quantity: req.body.quantity,
    });

    const save = await Cart.save(cart);
    if (!save) {
      return res
        .status(500)
        .send(errorResponse(res.statusCode, "Save cart failed"));
    }

    return res
      .status(200)
      .send(successResponse(res.statusCode, "Save cart success", cart));
  }

  //Cart co roi
  //Check coi da co san pham do trong cart chua hay them moi

  //Cong don
  let increase = false;
  for (const index in dbCart.productList) {
    if (dbCart.productList[index].productID === req.body.productID) {
      dbCart.productList[index].quantity += req.body.quantity;
      increase = true;
      break;
    }
  }

  //Them moi
  if (!increase) {
    dbCart.productList = dbCart.productList.push({
      productID: req.body.productID,
      quantity: req.body.quantity,
    });
  }

  const save2 = await Cart.save(dbCart);
  if (!save2) {
    return res
      .status(500)
      .send(errorResponse(res.statusCode, "Save cart failed"));
  }

  return res
    .status(200)
    .send(successResponse(res.statusCode, "Save cart success", dbCart));
}

async function removeFromCart(req, res, next) {}

async function changeQuantity(req, res, next) {}

module.exports = { getCart, emptyCart, addToCart };
