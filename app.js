var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//Import cors mo cong lien ket voi web-admin
const cors = require("cors");
//Import mongoose
const mongoose = require("mongoose");
//Khai bao model
require('./controllers/users/UserModel');
require('./controllers/categories/CateModal');
require('./controllers/products/ProductModal');
require('./controllers/carts/CartModal');
require('./controllers/types/TypeModal');
require('./controllers/orders/OrderModal');
require('./controllers/statistics/StatisticModal');




//RouterUsers
var usersRouter = require('./routes/users');
//RouterProducts
var productsRouter = require('./routes/products')
//CartRouter
var cartsRouter = require('./routes/carts');
//CategoryRouter
var categoriesRouter = require('./routes/categories');
//TypeProducts
var typeRouter = require('./routes/types');
//Order History
var orderRouter = require('./routes/orders');
//statistics
var routerStatistics = require('./routes/statistics');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Mo cong cho web ben ngoai truy xuat vao api, cho phép các domain khác gọi đến api
app.use(cors());
//Kết nối database
mongoose.connect("mongodb://127.0.0.1:27017/TreeShop")
  .then(() => console.log("Connect...."))
  .catch((error) => console.log("Could not connect database"));




//http://localhost:8888/users
app.use('/users', usersRouter);
//http://localhost:8888/products
app.use('/products', productsRouter);
//http://localhost:8888/carts
app.use('/carts', cartsRouter);
//http://localhost:8888/categories
app.use('/categories', categoriesRouter);
//http://localhost:8888/types
app.use('/types', typeRouter);
//http://localhost:8888/orders
app.use('/orders', orderRouter);
//http://localhost:8888/statistics
app.use('/statistics', routerStatistics);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
