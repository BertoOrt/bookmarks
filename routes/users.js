var express = require('express');
var router = express.Router();
var auth = require('./../lib/auth');
var route = require('./../controller/users');

router.get('/', auth.authorizeUser, function(req, res, next) {
  route.findUser(req.session.username).then(route.findBookmark).then(function (bookmarks) {
    res.render('users/index', {bookmarks: bookmarks, cookieId: req.session.username})
  })
});

module.exports = router;
