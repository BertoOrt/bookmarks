var express = require('express');
var router = express.Router();
var db = require('./../models');

router.get('/', function(req, res, next) {
  db.Users.findOne({_id: res.locals.userId}).then(function (user) {
    db.Bookmarks.find({_id: {$in: user.favorites}}).then(function (bookmarks) {
      res.render('users/index', {username: user.name, bookmarks: bookmarks})
    })
  })
});

module.exports = router;
