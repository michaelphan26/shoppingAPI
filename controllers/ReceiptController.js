const { Receipt } = require('../database/ReceiptModel')
const mongoose = require('mongoose')
const {validateReceipt} = require('../validators/ReceiptValidator')

//User
async function getReceiptList(req, res, next) {
    const receiptList = await Receipt.find({ email: req.user.email });
    if (!receiptList) {
        return res.status(400).send("Cannot get receipt list");
    }
    else if (receiptList.length === 0) {
        return res.status(404).send("Product list currently empty")
    }

    res.send(receiptList)
}

async function getReceiptDetail(req, res, next) {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const receiptDetail = await Receipt.findOne({ _id: id});
    if (!receiptDetail) {
        return res.status(400).send("Cannot get receipt detail");
    }

    res.send(receiptDetail)
}


//Admin
async function addReceipt(req, res, next) {
    const date = new Date().toLocaleDateString('en-GB');
    const receipt = {
        "productList": req.body.productList,
        "total": req.body.total,
    }

    const validateResult = validateReceipt(receipt);
    if (validateResult.error) {
        return res.status(400).send("Receipt detail is incorrect");
    }

    const dbReceipt = new Receipt({
        "productList": receipt.productList,
        "date": date,
        "total": receipt.total,
        "email": req.user.email,
        "status": false
    })
    const result = dbReceipt.save();
    if (!result) {
        return res.status(500).send("Failed to save receipt");
    }

    res.send(dbReceipt);
}

async function getFullReceiptList(req, res, next) {
    const receiptList = await Receipt.find({});
    if (!receiptList) {
        return res.status(400).send("Receipt list is empty");
    }

    res.send(receiptList);
}

module.exports={getReceiptList, getReceiptDetail, addReceipt, getFullReceiptList}