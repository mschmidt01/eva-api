var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var session = require('express-session')
const MongoStore = require('connect-mongo')(session);


var indexRouter = require('./routes/index');
var categoryRouter = require('./routes/category');
var customerRouter = require('./routes/customer');
var menuItemRouter = require('./routes/menuitem');
var orderRouter = require('./routes/order');
var orderItemRouter = require('./routes/orderitem');
var tableRouter = require('./routes/table');
var userRouter = require('./routes/user');

var app = express();

app.use(logger('dev'));
app.use(express.json());
mongoose.connect('mongodb+srv://eva_user:eva-i-ss20@cluster0.vrfwg.mongodb.net/eva?retryWrites=true&w=majority', {
  useNewUrlParser: true
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use(userRouter);
app.use(categoryRouter);
app.use(customerRouter);
app.use(menuItemRouter);
app.use(orderRouter);
app.use(orderItemRouter);
app.use(tableRouter);

module.exports = app;
