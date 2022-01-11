const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const User = require('./models/user');

const { handleErrors } = require('./middlewares');
const {
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    requireEmailExists,
    requireValidPasswordForUser
  } = require('./validators');

const router = express.Router();



router.get('/signup', (req, res) => {

    errors = [];
    
    res.render('admin/auth/signup', { req, errors});
  });

  var signUp = 'admin/auth/signup';
  var signIn = 'admin/auth/signIn';

  router.post(
    '/signup',
    [requireEmail, requirePassword, requirePasswordConfirmation],
    handleErrors(signUp),
     (req, res) => {
      const { email, password } = req.body;
      const newUser =  new User({email, password});
      
      newUser.save(function (err) {
        if (err){
          console.log(err);
        }
        else{
          res.redirect('/admin/products');
        }
      });
    }
  );
  
  router.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });
  
  router.get('/signin', (req, res) => {
    res.render('admin/auth/signin');
  });
  
  router.post(
    '/signin',
    [requireEmailExists, requireValidPasswordForUser],
    // handleErrors(signIn),
    async (req, res) => {
      const { email } = req.body;
  
      // const user = await usersRepo.getOneBy({ email });

      User.findOne({email}, (err, user) => {
          if (err) {
            console.log(err);
          } else {
            req.session.userId = user.id;

            res.redirect('/admin/products');
          }
        })
  
      
    }
  );

  
module.exports = router;