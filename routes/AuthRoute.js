const express=require('express');
const router=express.Router();
const {authLogin, authRegister} = require('../controllers/AuthController')
require('express-async-errors')

router.post('/login', authLogin)

router.post('/register', authRegister)

module.exports=router