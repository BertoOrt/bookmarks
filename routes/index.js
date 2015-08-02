var express = require('express');
var router = express.Router();
var db = require('./../models');
var logic = require('./../lib/logic.js')

router.get('/', function(req, res, next) {
  var categories;
  db.Categories.find().then(function (cats) {
    var bookmarks;
    categories = cats;
    var bookmarkIds = categories.reduce(function (current, category) {
        return current.concat(category.bookmarks);
      }, []);
    return db.Bookmarks.find({_id: {$in: bookmarkIds}}).then(function (allBookmarks) {
      bookmarks = allBookmarks;
      logic.joinCategoriesBookmarks(categories, bookmarks)
      return bookmarks
    }).then(function (bookmarks) {
      var bookmarksId = bookmarks.map(function (bookmark) {
        return bookmark.userId;
      })
      return db.Users.find({_id: {$in: bookmarksId}})
    }).then(function (users) {
      logic.bookmarksUsers(bookmarks, users);
      return categories
    })
  }).then(function (categories) {
    console.log(categories);
    res.render('index', {categories: categories});
  })
});

router.get('/stylesheet', function(req, res, next) {
  res.render('stylesheet');
});

module.exports = router;
