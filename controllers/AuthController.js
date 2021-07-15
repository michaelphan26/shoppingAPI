const {validateLogin,validateRegister}=require('../validators/UserValidator')
const mongoose=require('mongoose')
const { User, generateToken } = require('../database/UserModel')
const _=require('lodash')
const bcrypt=require('bcrypt')

async function authLogin(req, res, next){
    const user={
        "email":req.body.email.trim(),
        "password":req.body.password.trim(),
    }

    const validateResult=validateLogin(user);
    if(validateResult.error){
        return res.status(400).send(validateResult.error.message)
    } 
        
    const dbUser = await User.findOne({ email: user.email });
    const result=bcrypt.compare(req.body.password, dbUser.password);
    
    if (!result) {
        return res.status(400).send("Email or password is incorrect");
    }
    const token=await dbUser.generateToken()
    res.header('x-auth-token',token).send(_.omit(dbUser.toObject(),['_id','password','__v']))
}

async function authRegister(req, res, next) {
    let avai = await User.findOne({ email: req.body.email.trim() })
    if (avai) {
        return res.status(400).send("Email is already registered")
    }

    //dd-mm-yy with 24h
    const date=new Date().toLocaleString('en-GB');
    const user = {
        "email": req.body.email.trim(),
        "password": req.body.password.trim(),
        "name": req.body.name.trim(),
        "phone": req.body.phone.trim(),
        "address": req.body.address.trim(),
    }

    const validateResult=validateRegister(user);
    if(validateResult.error){ 
        return res.status(400).send(validateResult.error.message);;
    }

    const salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);

    const role = (req.body.admin === false || req.body.admin === undefined) ? false : true;

    const dbUser = new User({
        "email":user.email,
        "password":user.password,
        "name":user.name,
        "phone":user.phone,
        "address":user.address,
        "joinDate":date,
        "admin":role
    })
    
    const result=await dbUser.save()
    if(!result){
        return res.status(500).send("Something is wrong");
    }

    const token=await dbUser.generateToken();
    res.header('x-auth-token',token).send(_.omit(dbUser.toObject(),['_id','password','__v']));
    
}

module.exports = { authLogin, authRegister }