var mongoose = require("mongoose");
mongoose.connect("mongodb://" + process.env.MONGOLAB_URI);

module.exports.Users = require('./users.js');
module.exports.Bookmarks = require('./bookmarks.js');

// array.forEach(function (element) {
//   this.add(Card.apply(this, element))
// }, this)
