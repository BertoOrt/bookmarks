var db = require('./../models');
var bcrypt = require('bcryptjs');

module.exports = {

  loginPromise: function (name, password) {
    var promise = new Promise(function (resolve, reject) {
      db.Users.findOne({name: name}).then(function (user) {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
              resolve(user)
          } else {
            var error = 'Password is incorrect, please try again';
            reject(error)
          }
        } else {
          var error = 'Name not found, please try again';
          reject(error)
        }
      })
    })
    return promise
  },

  signupPromise: function (name, password) {
    var promise = new Promise(function (resolve, reject) {
      db.Users.findOne({name: name}).then(function (user) {
        var hash = bcrypt.hashSync(password, 8);
        if (user) {
          var error = 'Name already exists, please try again';
          reject(error)
        } else {
          db.Users.create({name: name, password: hash, favorites: [], bookmarks: []}).then(function () {
            return db.Users.findOne({name: name})
          }).then(function (user) {
              resolve(user)
          })
        }
      })
    })
    return promise
  }
}
