var mongoose = require("mongoose");
mongoose.connect("mongodb://" + process.env.MONGOLAB_URI);

module.exports.Users = require('./users.js');
module.exports.Bookmarks = require('./bookmarks.js');
module.exports.Categories = require('./categories.js');
