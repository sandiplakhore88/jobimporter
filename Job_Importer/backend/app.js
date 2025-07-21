const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {jobRoute} = require('./routes/jobRoutes');
const {logRoute} = require('./routes/logRoutes');
const {userRouter} = require('./routes/userRouter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/job', jobRoute);
app.use('/log', logRoute);
app.use('/user',userRouter);

module.exports = {app};