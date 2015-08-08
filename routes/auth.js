var express = require('express');
var router = express.Router();
var db = require('./../models');
var bcrypt = require('bcryptjs');
var Error = require('./../lib/error');
var auth = require('./../lib/auth');
var Errors = new Error;


router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

router.get('/login', auth.authorizeLogin, function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var password = req.body.password;
  var name = req.body.name;
  db.Users.findOne({name: name}).then(function (user) {
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
          req.session.username = user._id;
          res.redirect('/users/' + user._id);
      } else {
        var error = 'Password is incorrect, please try again';
        res.render('login', { flash: error });
      }
    } else {
      var error = 'Name not found, please try again';
      res.render('login', { flash: error })
    }
  })
});

router.get('/signup', auth.authorizeLogin, function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var hash = bcrypt.hashSync(password, 8);
  db.Users.findOne({name: name}).then(function (user) {
    if (user) {
      var error = 'Name already exists, please try again';
      res.render('signup', {flash: error})
    } else {
      db.Users.create({name: name, password: hash, favorites: [], bookmarks: []}).then(function () {
        return db.Users.findOne({name: name})
      }).then(function (user) {
          req.session.username = user._id;
          res.redirect('/users/' + user._id);
      })    
    }
  })
});

module.exports = router;
