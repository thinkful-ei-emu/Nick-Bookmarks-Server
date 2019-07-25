const express = require('express');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const BookmarkService = require('./bookmarks-service');

bookmarkRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    BookmarkService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        return res.json(bookmarks);
      })
      .catch(next); 
  })
  .post(bodyParser, (req, res) => {
    const { title, url, rating } = req.body;
    let { description } = req.body;
    const knexInstance = req.app.get('db');
    if(!description){
      description = null;
    }
    if(!title){
      return res
        .status(400)
        .send('Need title');
    }
    if(!rating || rating > 5 || rating < 1){
      return res
        .status(400)
        .send('Need valid rating between 1 - 5');
    }
    if(!url){
      return res
        .status(400)
        .send('Need url');
    }
    const newBookmark = {
      title, 
      url,
      description,
      rating
    };
    BookmarkService.insertBookmark(knexInstance, newBookmark)
      .then(bookmark => {
        return res
          .status(201)
          .location(`/${bookmark.id}`)
          .json(bookmark);
      });
  });

bookmarkRouter
  .route('/:id')
  .get((req, res, next) =>{
    const knexInstance = req.app.get('db');
    const { id } = req.params;
    if(!id){
      return res
        .status(404)
        .send('The id you sent does not exist');
    }
    BookmarkService.getById(knexInstance, id)
      .then(bookmark => {
        if(!bookmark){
          return res
            .status(404)
            .send('No Content');
        }
        return res
          .status(200)
          .send(bookmark);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;
    const knexInstance = req.app.get('db');
    if(!id){
      return res
        .status(404)
        .send('Need Valid Id');
    }
    BookmarkService.deleteBookmark(knexInstance, id)
      .then(() => {
        return res
          .status(204)
          .end();
      })
      .catch(next);
  });



module.exports = bookmarkRouter;