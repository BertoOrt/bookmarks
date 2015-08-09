var db = require('./../models');
var bcrypt = require('bcryptjs');
var logic = require('./../lib/logic.js')

module.exports = {

  findCategories: function () {
    return db.Categories.find({})
  },

  findCategory: function (categoryId) {
    return db.Categories.findOne({_id: categoryId})
  },

  findBookmarks: function (category) {
    var promise = new Promise(function (resolve, reject) {
      var bookmarks;
      db.Bookmarks.find({_id: {$in: category.bookmarks}}).then(function (bm) {
        bookmarks = bm;
        var usersId = bookmarks.map(function (bookmark) {
          return bookmark.userId;
        })
        return db.Users.find({_id: {$in: usersId}})
      }).then(function (users) {
        logic.bookmarksUsers(bookmarks, users);
        resolve({category: category, bookmarks: bookmarks})
      })
    })
    return promise;
  },

}
