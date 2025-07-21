const express = require('express');
const { getLogs } = require('../controllers/logController');
const {authUser,authRole} = require('../middlewares/roleBaseAuth');

const logRoute = express.Router();

logRoute.get('/getLogs',authUser,authRole('Admin') ,getLogs);

module.exports = {logRoute};