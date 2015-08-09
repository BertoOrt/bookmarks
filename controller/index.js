var db = require('./../models');
var bcrypt = require('bcryptjs');
var logic = require('./../lib/logic.js')

module.exports = {

  findCategories: function () {
    return db.Categories.find();
  },

  findBookmarks: function (categories) {
    var bookmarks;
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
  },

  categoriesFilter: function (categories, search) {
    return categories.filter(function (category) {
      if (category.name.indexOf(search) > -1) {
        return category
      }
    })
  },

  pushFavorite: function (user, bookmark) {
    return db.Users.update({_id: user}, {$push: {favorites: bookmark}})
  },

  pullFavorite: function (user, bookmark) {
    return db.Users.update({_id: user}, {$pull: {favorites: bookmark}})
  },

}
