var express = require('express');
var router = express.Router();
var db = require('./../models');
var bcrypt = require('bcryptjs');
var Error = require('./../lib/error');
var Errors = new Error;

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  var name = req.body.name;
  db.Users.findOne({name: name}).then(function (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.username = user._id;
        res.redirect('/users/' + user._id);
    }
    else {
      res.render('/login', {error: error})
    }
  })
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var hash = bcrypt.hashSync(password, 8);
  req.session.username = name;
  db.Users.create({name: name, password: hash, favorites: [], bookmarks: []}).then(function () {
    return db.Users.findOne({name: name})
  }).then(function (user) {
      res.redirect('/users/' + user._id);
  })
});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
