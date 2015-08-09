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

  removeBookmark: function (bookmark) {
    return db.Bookmarks.findOneAndRemove({_id: bookmark._id}).then(function () {
      return bookmark
    })
  },

  updateUser: function (bookmark) {
    return db.Users.update({_id: bookmark.userId}, {$pull: {bookmarks: bookmark._id}}).then(function () {
      return bookmark;
    });
  },

  deleteCategories: function (bookmark) {
    return db.Categories.update({}, {$pull: {bookmarks: bookmark._id}}, {multi: true}).then(function () {
      return bookmark;
    })
  },

  updateCategories: function (resolve) {
    return db.Categories.update({}, {$pull: {bookmarks: resolve.bookmark._id}}, {multi: true}).then(function () {
      return resolve.bookmark;
    })
  },

  editBookmark: function (name, url, userId, bookmarkId, description, categories) {
    var promise = new Promise(function (resolve, reject) {
      db.Bookmarks.findByIdAndUpdate(bookmarkId, {$set: {name: name, url: url,
         userId: userId, description: description,
         categories: categories}}).then(function (bookmark) {
           resolve({bookmark:bookmark, categories: categories, userId: userId})
         })
    })
    return promise;
  },

  allPromisePush: function (result) {
    var promise = new Promise(function (resolve, reject) {
      Promise.all(result.categories.map(function (category) {
        return db.Categories.update({name: category}, {name: category, $push: {bookmarks: result.bookmark._id} }, {upsert: true})
      })).then(function (data) {
        resolve({bookmark: result.bookmark, userId: result.userId})
      })
    })
    return promise
  },

  allPromisePull: function (result) {
    var promise = new Promise (function (resolve, reject) {
      db.Categories.update({}, {$pull: {bookmarks: result.bookmark._id}}, {multi: true}).then(function () {
        resolve(result)
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
