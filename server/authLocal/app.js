#!/usr/bin/env node
'use strict';

var express = require('express')
  , routes = require('./routes')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session  = require('express-session')
  , passport = require('passport')
  , passportConfig = require('./config/passport')
  , db = require('./models')
  , user = require('./routes/user')
  , index = require('./routes/index')
  , home = require('./routes/home')
  , application = require('./routes/application')
  , app = express();


const SALT_WORK_FACTOR = 12;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index)
//app.use('/users', users);
app.get('/home', application.IsAuthenticated, home.homepage)
app.post('/authenticate',
  passport.authenticate('local',{
	successRedirect: '/home',
	failureRedirect: '/'
  })
)
app.get('/logout', application.destroySession)
app.get('/signup', user.signUp)
app.post('/register', user.register)

// 
// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

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
  res.render('error');
});

module.exports = app;
