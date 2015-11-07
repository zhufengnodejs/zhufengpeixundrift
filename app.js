var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var bottle = require('./routes/bottle');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var Bottle = require('./model/Bottle');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret:'drift',
  resave:true,
  saveUninitialized:false,
  store:new RedisStore({
    host:'123.57.143.189',
    port:6379
  })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
  res.locals.user = req.session.user ||  {throwTimes:0,pickTimes:0};
  var user = res.locals.user;
  if(user.username){
    Bottle.getTimes(user.username,function(err,data){
      user.throwTimes = data.throwTimes;
      user.pickTimes = data.pickTimes;
      console.log(user);
      next();
    })
  }else{
    next();
  }


});
app.use('/', routes);
app.use('/users', users);// /users/add
app.use('/bottle', bottle);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
