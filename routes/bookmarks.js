var express = require('express');
var router = express.Router();
var logic = require('./../lib/logic.js');
var db = require('./../models');
var auth = require('./../lib/auth');
var route = require('./../controller/bookmarks');


router.get('/', auth.authorizeUser, function(req, res, next) {
  route.findUser(res.locals.userId).then(route.findBookmarks).then(function (bookmarks) {
    res.render('bookmarks/index', {bookmarks: bookmarks, cookieId: req.session.username})
  })
});

router.get('/new', function (req, res, next) {
  res.render('bookmarks/new', {cookieId: req.session.username, categories: (logic.categories).sort()})
})

router.get('/:id', function (req, res, next) {
  route.findBookmark(req.params.id).then(route.findUsers).then(function (result) {
    var favorite = route.favorite(result.users, req.session.username);
    res.render('bookmarks/show', {bookmark: result.bookmark, favorite: favorite, cookieId: req.session.username})
  })
})

router.get('/:id/edit', auth.authorizeUser, function (req, res, next) {
  route.findBookmark(req.params.id).then(function (bookmark) {
    res.render('bookmarks/edit', {cookieId: req.session.username, bookmark: bookmark, categories: (logic.categories).sort()})
  })
})

router.get('/:id/delete', auth.authorizeUser, function (req, res, next) {
  route.removeBookmark(req.params.id).then(route.updateUser).then(route.updateCategories).then(function () {
    res.redirect('/users/' + req.session.username + '/bookmarks')
  })
})

router.post('/:id/edit', function (req, res, next) {
  var name = req.body.name;
  var url = req.body.url;
  var userId = req.session.username;
  var description = req.body.description;
  var categories = logic.clean(req.body.categories.split(' '));
  var bookmarkId = req.params.id;
  route.editBookmark(name, url, userId, bookmarkId, description, categories).then(route.allPromise).then(route.updateCategories).then(function () {
    res.redirect('/users/' + userId + '/bookmarks')
  })
})

router.post('/new', function (req, res, next) {
  var name = req.body.name;
  var url = req.body.url;
  var userId = req.session.username;
  var description = req.body.description;
  var categories = logic.clean(req.body.categories.split(' '));
  route.createBookmark(name, url, userId, description, categories).then(route.allPromise).then(route.updateUserBookmark).then(function () {
    res.redirect('/users/' + userId + '/bookmarks')
  })
})

module.exports = router;
