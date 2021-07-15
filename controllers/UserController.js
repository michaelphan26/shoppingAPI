const mongoose = require('mongoose')
const { User } = require('../database/UserModel')
const _=require('lodash')

//User
async function getUserDetail(req, res, next) {
    const email = req.user.email;
    const user = await User.findOne({ email: email });
    if (!user) {
        res.status(400).send("Cannot get user detail");
    }

    res.send(_.omit(user.toObject(),['_id','password','__v']));
}

//Admin
async function getAccountList(req, res, next) {
    const userList = await User.find({});
    if (!userList) {
        return res.status(400).send("User list is empty")
    }

    res.send(userList)
}

module.exports={getUserDetail, getAccountList}