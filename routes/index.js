var express = require('express');
var router = express.Router();
var route = require('./../controller/index'); //dao = data access object

router.get('/', function (req, res, next) {
  res.render('index', {cookieId: req.session.username});
})

router.get('/search', function(req, res, next) {
  route.findCategories().then(route.findBookmarks).then(function (categories) {
    res.json({'categories': route.categoriesFilter(categories, req.query.search)});
  })
});

router.get('/favorite', function (req, res, next) {
  var user = req.session.username;
  var bookmark = req.query.bookmark;
  if (req.query.checked === 'yes') {
    route.pushFavorite(user,bookmark).then(function () {})
  } else {
    route.pullFavorite(user,bookmark).then(function () {})
  }
})

router.get('/stylesheet', function(req, res, next) {
  res.render('stylesheet');
});

module.exports = router;
