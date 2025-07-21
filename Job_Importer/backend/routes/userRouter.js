const {loginByPassword} = require('../controllers/userController');
const express = require('express');

const userRouter = express.Router();

userRouter.post('/loginByPassword', loginByPassword);//login user

module.exports = {userRouter};