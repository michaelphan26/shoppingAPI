const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:2,
        maxLength:64,
        trim:true
    },
    brand:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
        trim:true,
    },
    category:{
        type:String,
        required:true,
        minLength:2,
        maxLength:20,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
        min:1000,
        max:1000000000
    },
    stock:{
        type:Number,
        required:true,
        min:0,
        max:1000
    },
    image:{
        type:Buffer,
        trim:true,
    },
})

const Product = mongoose.model("Product", productSchema);

exports.Product = Product;