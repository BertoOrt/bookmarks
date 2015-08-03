module.exports = {
  joinCategoriesBookmarks : function (categories, bookmarks) {
    var indexed = bookmarks.reduce(function (result, bookmark) {
      result[bookmark._id.toString()] = bookmark
      return result
    }, {})
    categories.forEach(function (category) {
      category.bookmarks = category.bookmarks.map(function (_id) {
        return indexed[_id.toString()]
      })
    })
    return categories
  },

  bookmarksUsers: function (bookmarks, users) {
    return bookmarks.map(function (bookmark) {
      users.forEach(function (user) {
        if (user._id.toString() === bookmark.userId.toString()) {
          console.log(bookmark);
          bookmark.user = user;
          console.log(bookmark);
        }
      })
      return bookmarks
    })
  }

}
