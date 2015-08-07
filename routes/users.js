var express = require('express');
var router = express.Router();
var db = require('./../models');
var auth = require('./../lib/auth');

router.get('/', auth.authorizeUser, function(req, res, next) {
  db.Users.findOne({_id: res.locals.userId}).then(function (user) {
    db.Bookmarks.find({_id: {$in: user.favorites}}).then(function (bookmarks) {
      res.render('users/index', {username: user.name, bookmarks: bookmarks, cookieId: req.session.username})
    })
  })
});

module.exports = router;
