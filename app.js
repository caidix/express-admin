var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session')
var logger = require('morgan');


var app = express();
app.use(require('cors')(
  {
    "origin": true,
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  }
));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/web', express.static(__dirname + '/web'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser('blog_node_cookie'));
app.use(
  session({
    secret: 'blog_node_cookie',
    cookie: { maxAge: 60 * 1000 * 30, secure: false }, //过期时间
    name: 'session_id', //# 在浏览器中生成cookie的名称key，默认是connect.sid
    resave: false,
    saveUninitialized: true,

  }),
);

require('./utils/database')(app);
require('./routes/user')(app);
require('./routes/admin')(app);
require('./routes/blog')(app);

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
