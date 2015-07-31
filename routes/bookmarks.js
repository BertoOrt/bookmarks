var express = require('express');
var router = express.Router();
var db = require('./../models');

router.get('/', function(req, res, next) {
  db.Users.findOne({_id: res.locals.userId}).then(function (user) {
    console.log('here?');
    return db.Bookmarks.find({_id: {$in: user.bookmarks}})
  }).then(function (bookmarks) {
    console.log('here');
    res.render('bookmarks/index', {bookmarks: bookmarks})
  })
});

router.get('/new', function (req, res, next) {
  res.render('bookmarks/new')
})

router.get('/:id', function (req, res, next) {
  db.Bookmarks.findOne({_id: req.params.id}).then(function (bookmark) {
    res.render('bookmarks/show', {bookmark: bookmark})
  })
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
     type: type, categories: categories}).then(function (bookmark) {
      db.Users.findByIdAndUpdate(userId, {$push: {bookmarks: bookmark._id}}, {safe: true, upsert: false, new: true}, function (err, model) {
      res.redirect('/users/' + userId + '/bookmarks')
    })
  });
})

module.exports = router;
