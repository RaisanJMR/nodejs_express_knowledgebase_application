const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
// Bring in User models
let User = require('../models/user');

// register form
router.get('/register', (req, res) => {
  res.render('register', {
    heading: 'Register',
  });
});

// user registration process
router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'name is needed').notEmpty();
  req.checkBody('email', 'email is needed').notEmpty();
  req.checkBody('email', 'email is not valid').isEmail();
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password2', 'password not match').equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.render('register', {
      errors: errors,
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
    });
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(newUser.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function (err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash('success', 'you are now registered and can login');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});
// login form
router.get('/login', function (req, res) {
  res.render('login', {
    heading: 'Login',
  });
});
// login router
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});
// logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'you are logged out');
  res.redirect('/users/login');
});
module.exports = router;
