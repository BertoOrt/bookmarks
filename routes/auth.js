var express = require('express');
var router = express.Router();
var auth = require('./../lib/auth');
var route = require('./../controller/auth');

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
  route.loginPromise(name, password).then(function (user) {
    req.session.username = user._id;
    res.redirect('/users/' + user._id);
  }, function (error) {
    res.render('login', { flash: error });
  })
});

router.get('/signup', auth.authorizeLogin, function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  route.signupPromise(name, password).then(function (user) {
    req.session.username = user._id;
    res.redirect('/users/' + user._id);
  }, function (error) {
    res.render('signup', { flash: error });
  })
});

module.exports = router;
