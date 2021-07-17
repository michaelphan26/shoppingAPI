const express=require('express')
const router = express.Router();
const {auth} = require('../middlewares/AuthMiddleware');
const {getReceiptList, getReceiptDetail, addReceipt}=require('../controllers/ReceiptController')

router.get('/receipt-list',auth,getReceiptList)

router.get('/receipt-detail/:id', auth, getReceiptDetail);

router.post('/add-receipt',auth ,addReceipt)

module.exports=router