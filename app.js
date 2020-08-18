var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
mongoose.connect('mongodb+srv://eva_user:eva-i-ss20@cluster0.vrfwg.mongodb.net/eva?retryWrites=true&w=majority', {
  useNewUrlParser: true
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
