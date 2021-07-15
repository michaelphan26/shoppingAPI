const express=require('express');
const router = express.Router();
const {auth}=require('../middlewares/AuthMiddleware')
const {getProductList, getProductDetail, addProduct} = require('../controllers/ProductController')

router.get('/product-list',auth,getProductList)

router.get('/product-detail/:id', auth, getProductDetail)

module.exports=router