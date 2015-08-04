var express = require('express');
var router = express.Router();
var db = require('./../models');
var logic = require('./../lib/logic.js');

router.get('/', function(req, res, next) {
  db.Users.findOne({_id: res.locals.userId}).then(function (user) {
    return db.Bookmarks.find({_id: {$in: user.bookmarks}})
  }).then(function (bookmarks) {
    res.render('bookmarks/index', {bookmarks: bookmarks})
  })
});

router.get('/new', function (req, res, next) {
  res.render('bookmarks/new', {categories: (logic.categories).sort()})
})

router.get('/:id', function (req, res, next) {
  var bookmark, favorite;
  db.Bookmarks.findOne({_id: req.params.id}).then(function (bm) {
    bookmark = bm;
    return db.Users.find({favorites: String(bookmark._id)})
  }).then(function (data) {
    data.forEach(function (user) {
      if (String(user._id) === String(res.locals.userId)) {
        favorite = true
      }
    })
    res.render('bookmarks/show', {bookmark: bookmark, favorite: favorite})
  })
})

router.get('/:id/edit', function (req, res, next) {
  db.Bookmarks.findOne({_id: req.params.id}).then(function (bookmark) {
    res.render('bookmarks/edit', {bookmark: bookmark, categories: (logic.categories).sort()})
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
  var categories = logic.clean(req.body.categories.split(' '));
  db.Bookmarks.findByIdAndUpdate(req.params.id, {$set: {name: name, url: url,
     userId: userId, description: description,
     categories: categories}}).then(function (bm) {
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
  var categories = logic.clean(req.body.categories.split(' '));
  db.Bookmarks.create({name: name, url: url,
    userId: userId, description: description,
    categories: categories}).then(function (bm) {
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
