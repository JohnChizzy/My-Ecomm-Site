const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');

const { handleErrors, requireAuth } = require('./middlewares');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: {
    data:  Buffer,
    contentType: String
  }
});

const Product =  mongoose.model('Product', productSchema);

var newProduct = 'admin/products/new';
var editProduct = 'admin/products/edit';

router.get('/admin/products', requireAuth, async (req, res) => {
  Product.find({}, function(err, products){
    res.render('admin/products/index', { products });
  });
});

router.get('/admin/products/new', requireAuth, (req, res) => {
  var errors = {};
  res.render('admin/products/new', {errors});
});


router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(newProduct),
   (req, res) => {
    const image = req.file.buffer.toString('base64');
    const { title, price } = req.body;
    const newProduct = new Product({image, title, price});

    newProduct.save(function 
      (err) {
        if(err){
          console.log(err);
          res.redirect('admin/products/new');
        }
        else{
          res.redirect('/admin/products');
        }
    })

    
  }
);

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  var edit = 'admin/products/edit';
  await Product.findOne({_id: req.params.id}, (err, product) => {
    if (err){
      console.log(err);
    }
    else if(!product){
      return res.send('Product not found');
    }
  });

  res.render('edit', { product });
});

router.post(
  '/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(editProduct, async req => {
    await Product.findOne({_id: req.params.id}, (err, product) => {
      return { product };
    });
  }),
  async (req, res) => {
    const changes = req.body;

    if (req.file) {
      changes.image = req.file.buffer.toString('base64');
    }

    
      await Product.updateOne({_id: req.params.id}, changes, function(err){
        if(err) {
          return res.send('Could not find item');
        } else{
          res.redirect('/admin/products');
        }
      });
     
  }
);

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
  await Product.deleteOne({_id: req.params.id}, function(err){
    if(err){
      console.log(err);
    }
    else{
      res.redirect('/admin/products');
    }
  });

});

module.exports = router;
