var express = require('express');
var router = express.Router();
var db = require('./../models');
var logic = require('./../lib/logic.js')

router.get('/', function (req, res, next) {
  db.Categories.find({}).then(function (categories) {
    res.render('categories/index', {categories: categories})
  })
})

router.get('/:id', function (req, res, next) {
  var category;
  db.Categories.findOne({_id: req.params.id}).then(function (cat) {
    category = cat;
    return db.Bookmarks.find({_id: {$in: category.bookmarks}})
  }).then(function (bookmarks) {
    res.render('categories/show', {category: category, bookmarks: bookmarks})
  })
})

module.exports = router
