var mongoose = require('mongoose');

var bookmarkSchema = new mongoose.Schema({
    name: String,
    url: String,
    userId: String,
    description: String,
    type: String,
    categories: Array,
});

var Bookmark =  mongoose.model("Bookmark", bookmarkSchema);

module.exports = Bookmark;
