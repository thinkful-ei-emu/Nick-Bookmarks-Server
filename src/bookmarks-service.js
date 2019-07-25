const BookmarksService = {
  getAllBookmarks(db) {
    return db('bookmarks')
      .select('*');
  },
  insertBookmark(db, newBookmark) {
    return db('bookmarks')
      .insert(newBookmark)
      .into('bookmarks')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db('bookmarks')
      .select('*')
      .where('id', id)
      .first();
  },
  deleteBookmark(db, id) {
    return db('bookmarks')
      .where({ id })
      .delete();
  },
  updateArticle(db, id, newArticleFields) {
    return db('bookmarks')
      .where({ id })
      .update(newArticleFields);
  }

};

module.exports = BookmarksService;