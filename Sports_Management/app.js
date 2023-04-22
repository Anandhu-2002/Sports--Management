var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session=require('express-session');
var logger = require('morgan');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
const hbs=require('express-handlebars');
var db=require('./dbconnection/connection');


var app = express();
var fileupload=require('express-fileupload')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layouts/',partialsDir:__dirname+'/views/partials/'}))
app.use(fileupload())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:"Key",saveUninitialized:true,resave:false,cookie:{maxAge:(600000)}}))
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/admin', adminRouter);





db.connect((err)=>{
  if(err)
  console.log("Dbconnection Error"+err);
  else
  console.log("Dbconnection success")
});//db connect

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  
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
