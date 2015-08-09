var db = require('./../models');
var bcrypt = require('bcryptjs');
var logic = require('./../lib/logic.js');

module.exports = {

  findUser: function (userId) {
    return db.Users.findOne({_id: userId})
  },

  findBookmarks: function (user) {
    return db.Bookmarks.find({_id: {$in: user.bookmarks}})
  },

  findBookmark: function (id) {
    return db.Bookmarks.findOne({_id: id})
  },

  findUsers: function (bookmark) {
    var promise = new Promise(function (resolve, reject) {
      db.Users.find({favorites: String(bookmark._id)}).then(function (users) {
        resolve({users:users, bookmark:bookmark})
      })
    })
    return promise
  },

  favorite: function (users, id) {
    var favorite = false;
    users.forEach(function (user) {
      if (String(user._id) === String(id)) {
        favorite = true
      }
    })
    return favorite
  },

  removeBookmark: function (id) {
    return db.Bookmarks.findOneAndRemove({_id: id})
  },

  updateUser: function (bookmark) {
    db.Users.update({_id: bookmark.userId}, {$pull: {bookmarks: bookmark._id}});
    return bookmark;
  },

  updateCategories: function (bookmark) {
    db.Categories.update({}, {$pull: {bookmarks: bookmark._id}}, {multi: true});
    return bookmark;
  },

  editBookmark: function (name, url, userId, bookmarkId, description, categories) {
    var promise = new Promise(function (resolve, reject) {
      db.Bookmarks.findByIdAndUpdate(bookmarkId, {$set: {name: name, url: url,
         userId: userId, description: description,
         categories: categories}}).then(function (bookmark) {
           resolve({bookmark:bookmark, categories: categories})
         })
    })
    return promise;
  },

  allPromise: function (result) {
    var promise = new Promise(function (resolve, reject) {
      Promise.all(result.categories.map(function (category) {
        return db.Categories.update({name: category}, {name: category, $push: {bookmarks: result.bookmark._id} }, {upsert: true})
      })).then(function () {
        resolve({bookmark: result.bookmark, userId: result.userId})
      })
    })
    return promise
  },

  createBookmark: function (name, url, userId, description, categories) {
    var promise = new Promise(function (resolve, reject) {
      db.Bookmarks.create({name: name, url: url,
        userId: userId, description: description,
        categories: categories}).then(function (bookmark) {
        resolve({bookmark: bookmark, categories: categories, userId: userId})
      })
    })
    return promise;
  },

  updateUserBookmark: function (resolve) {
    return db.Users.findByIdAndUpdate(resolve.userId, {$push: {bookmarks: resolve.bookmark._id}}, {new: true})
  }

}
