var db = require('./../models');
var bcrypt = require('bcryptjs');

module.exports = {

  findUser: function (userId) {
    return db.Users.findOne({_id: userId})
  },

  findBookmark: function (user) {
    return db.Bookmarks.find({_id: {$in: user.favorites}})
  }

}
