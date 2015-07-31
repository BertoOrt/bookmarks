var express = require('express');
var router = express.Router();
var db = require('./../models');

router.get('/', function(req, res, next) {
  db.Users.findOne({_id: res.locals.userId}).then(function (user) {
    res.render('bookmarks/index')
  })
});

router.get('/new', function (req, res, next) {
  res.render('bookmarks/new')
})

router.post('/new', function (req, res, next) {
  var name = req.body.name;
  var url = req.body.url;
  var userId = res.locals.userId;
  var description = req.body.description;
  var type = req.body.type;
  var categories = [];
  db.Bookmarks.create({name: name, url: url,
     userId: userId, description: description,
     type: type, categories: categories}).then(function () {
       res.redirect('/users/' + res.locals.userId + '/bookmarks')
    })
})

module.exports = router;
