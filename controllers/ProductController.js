const { Product } = require('../database/ProductModel')
const mongoose = require('mongoose')
const { validateProduct } = require('../validators/ProductValidator')
const _=require('lodash')

//User
async function getProductList(req, res, next) {
    const productList = await Product.find({})
    if (!productList) {
        return res.status(404).send("Cannot get product list");
    }
    else if (productList.length === 0) {
        return res.status(404).send("Product list currently empty")
    }

    res.send(productList);
}

async function getProductDetail(req, res, next) {
    const id = new mongoose.Types.ObjectId(req.params.id)
    console.log(id)
    const product = await Product.findOne({ _id: id });
    if (!product) {
        return res.status(404).send("Cannot get product detail");
    }

    res.send(_.omit(product.toObject(),['__v']))
}


//Admin
async function addProduct(req, res, next) {
    const product = {
        "name": req.body.name.trim(),
        "brand": req.body.brand.trim(),
        "category": req.body.category.trim(),
        "price": req.body.price,
        "stock": req.body.stock,
        "image": req.body.image.trim(),
    }

    const validateResult = validateProduct(product);
    if (validateResult.error) {
        return res.status(400).send(validateResult.error.message);
    }

    const dbProduct = new Product({
        "name": product.name,
        "brand": product.brand,
        "category": product.category,
        "price": product.price,
        "stock": product.stock,
        "image": product.image
    })
    const result = await dbProduct.save();
    if (!result) {
        return res.status(400).send("Failed to add product");
    }

    res.send(dbProduct);
}

async function deleteProduct(req, res, next) {
    const id = mongoose.Types.ObjectId(req.params.id);
    const result = await Product.findByIdAndRemove({_id: id});
    if (result) {
        return res.status(400).send("Failed to delete product");
    }

    res.send("Delete product successful");
}

async function editProduct(req, res, next) {
    const newDetail = {
        "name": req.body.name.trim(),
        "brand": req.body.brand.trim(),
        "category": req.body.category.trim(),
        "price": req.body.price,
        "stock": req.body.stock,
        "image": req.body.image.trim()
    }

    const validateResult = validateProduct(newDetail);
    if (validateResult.error) {
        return res.status(400).send(validate.error.message);
    }

    const id = mongoose.Types.ObjectId(req.params.id);
    const result = await Product.findOneAndUpdate({ _id: id }, {$set:{
        name: newDetail.name,
        brand: newDetail.brand,
        category: newDetail.category,
        price: newDetail.price,
        stock: newDetail.stock,
        image: newDetail.image
    }
    });
    if (!result) {
        return res.status(400).send("Failed to edit product")
    }

    res.send("Update successful")
}

module.exports={getProductList, getProductDetail, addProduct, deleteProduct, editProduct}