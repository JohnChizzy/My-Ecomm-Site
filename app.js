//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/ecommDB", {useUnifiedTopology:true, useNewUrlParser: true });

app.use(
  cookieSession({
    keys: ['ghdfhsdhjf']
  })
);

app.use(flash());
app.use(function(req, res, next){
  res.locals.success = req.flash('success');
  res.locals.info = req.flash('info');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use(authRouter);
// app.use(productsRouter);
// app.use(adminProductsRouter);
// app.use(cartsRouter);




app.listen(3000, function() {
  console.log("Server started on port 3000");
});



// I stopped at displaying the signup page and I had issues displaying the error messages