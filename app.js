/**
 * Primary Health Networks Quality of Life Survey
 * 
 * This Express.js web application manages the storage and retrieval of data for
 * the PHN QoL Survey, as implemented by Patternworks in Q2, 2016. See README.md
 * for detailed information about the web app.
 * 
 * Extensive testing is conducted using Mocha, see the `test/` directory for the
 * test scheduler. This is vital for the continuous delivery model that this app
 * uses for maintenance, feature extensions, etc.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 * @version 0.1.0
 */

// Load our environment variables, if they exist.
// if (process.env.NODE_ENV !== 'test') {
//   console.log("NODE_ENV is NOT test. ABORTING.");
//   exit(1);
//   require('dotenv').config(
//     {
//       silent: true,
//       path: process.env.DOTENV_FILE
//     }
//   );
// }

// Start the Express app.
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var questionsRoute = require('./routes/questions');
var surveyRoute = require('./routes/survey');

var app = express();

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

app.use('/', routes);
app.use('/questions/', questionsRoute);
app.use('/survey/', surveyRoute);

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
