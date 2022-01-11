const mongoose = require('mongoose');
const { check } = require('express-validator');

module.exports = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 40 })
    .withMessage('Must be between 5 and 40 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be a number greater than 1'),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom( email => {
      return new Promise((resolve, reject) => {
        User.findOne({ email }, function(err, existingUser){
          if (existingUser) {
            reject(new Error('Email in use'));
          }
          resolve(true)
        });
      }) 
      
      
    }),
  
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters')
    .custom(async (passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match');
      }
    }),
  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async email => {
      await User.findOne({ email }, function(err, user){
        if (!user) {
          return Promise.reject('Email not found!');
        }
      });
      
    }),
    
  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      await User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          throw new Error('Invalid password');
        }
      });
      

      const validPassword = await User.comparePasswords(
        user.password,
        password
      );
      if (!validPassword) {
        throw new Error('Invalid password');
      }
    })
};
