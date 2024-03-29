var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var conf = require("./config");
var hbs = require('hbs');

var index = require('./routes/index');
var adminUsers = require('./routes/adminusers');
var home = require('./routes/home');
var authenticate = require('./middlewares/authenticate');
var metrics = require('./routes/metrics');
var monitors = require('./routes/monitors');
var appInfos = require('./routes/appinfos');
var products = require('./routes/products');
var catalogs = require('./routes/catalogs');
var hbsHelpers = require('./utils/HBSHelpers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbsHelpers.registerHelpers(hbs);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(conf.get('cookie.secret')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//authenticate middleware
app.use(authenticate);
app.use('/home', home);
app.use('/admins', adminUsers);
app.use('/metrics', metrics);
app.use('/monitors', monitors);
app.use('/apps', appInfos);
app.use('/products', products);
app.use('/catalogs', catalogs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.error(err)
  res.render('error');
});

module.exports = app;
