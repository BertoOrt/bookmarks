var express = require('express');
var router = express.Router();
var db = require('./../models');
var route = require('./../controller/categories');

router.get('/', function (req, res, next) {
  route.findCategories().then(function (categories) {
    res.render('categories/index', {categories: categories, cookieId: req.session.username})
  })
})

router.get('/:id', function (req, res, next) {
  route.findCategory(req.params.id).then(route.findBookmarks).then(function (result) {
    res.render('categories/show', {category: result.category, bookmarks: result.bookmarks, cookieId: req.session.username})
  })
})

module.exports = router
