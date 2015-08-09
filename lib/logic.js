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
          bookmark.user = user;
        }
      })
      return bookmarks
    })
  },

  categories: ['html', 'css', 'mongodb', 'mongoose', 'validator',
                'database', 'deploy', 'github', 'class-assignments',
                'javascript', 'python', 'ruby', 'video', 'cdn', 'diagrams',
              'node', 'express', 'promise', 'oop', 'library', 'framework',
              'language', 'go', 'react', 'angular', 'sql', 'vps', 'npm',
              'login', 'cookie', 'algorithms', 'problems', 'tracker',
              'job', 'cool', 'instructional', 'tutorial'],

  clean: function (array) {
    return array.filter(function (e) {
      if (e.trim() !== "") {
        return e
      }
    })
  },
}
