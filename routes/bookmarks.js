var express = require('express');
var router = express.Router();
var db = require('./../models');

router.get('/', function(req, res, next) {
  db.Users.findOne({_id: res.locals.userId}).then(function (user) {
    return db.Bookmarks.find({_id: {$in: user.bookmarks}})
  }).then(function (bookmarks) {
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

router.get('/:id/edit', function (req, res, next) {
  db.Bookmarks.findOne({_id: req.params.id}).then(function (bookmark) {
    res.render('bookmarks/edit', {bookmark: bookmark})
  })
})

router.get('/:id/delete', function (req, res, next) {
  var bookmark;
  db.Bookmarks.findOneAndRemove({_id: req.params.id}).then(function (bm) {
    bookmark = bm;
    return db.Users.update({_id: bookmark.userId}, {$pull: {bookmarks: bookmark._id}})
  }).then(function () {
    return db.Categories.update({}, {$pull: {bookmarks: bookmark._id}}, {multi: true})
  }).then(function () {
    res.redirect('/users/' + res.locals.userId + '/bookmarks')
  })
})

router.post('/:id/edit', function (req, res, next) {
  var bookmark;
  var name = req.body.name;
  var url = req.body.url;
  var userId = res.locals.userId;
  var description = req.body.description;
  var type = req.body.type;
  var categories = req.body.categories.split(' ');
  categories.pop();
  db.Bookmarks.findByIdAndUpdate(req.params.id, {$set: {name: name, url: url,
     userId: userId, description: description,
     type: type, categories: categories}}).then(function (bm) {
    bookmark = bm;
    return db.Categories.update({}, {$pull: {bookmarks: bookmark._id}}, {multi: true})
  }).then(function () {
    return Promise.all(categories.map(function (category) {
      return db.Categories.update({name: category}, {name: category, $push: {bookmarks: bookmark._id} }, {upsert: true})
    }))
  }).then(function () {
    res.redirect('/users/' + userId + '/bookmarks')
  })
})

router.post('/new', function (req, res, next) {
  var bookmark;
  var name = req.body.name;
  var url = req.body.url;
  var userId = res.locals.userId;
  var description = req.body.description;
  var type = req.body.type;
  var categories = req.body.categories.split(' ');
  categories.pop();
  db.Bookmarks.create({name: name, url: url,
    userId: userId, description: description,
    type: type, categories: categories}).then(function (bm) {
      bookmark = bm;
      return db.Users.findByIdAndUpdate(userId, {$push: {bookmarks: bookmark._id}}, {new: true})
  }).then(function () {
    return Promise.all(categories.map(function (category) {
      return db.Categories.update({name: category}, {name: category, $push: {bookmarks: bookmark._id} }, {upsert: true})
    }))
  }).then(function () {
    res.redirect('/users/' + userId + '/bookmarks')
  })
})

module.exports = router;
