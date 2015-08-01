var express = require('express');
var router = express.Router();
var db = require('./../models');

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/stylesheet', function(req, res, next) {
  res.render('stylesheet');
});

module.exports = router;
