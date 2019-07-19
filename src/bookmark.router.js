const express = require('express');
const bookmarks = require('./STORE');
const uuid = require('uuid/v4');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { name, rating } = req.body;
    if(!name){
      res
        .status(400)
        .send('Need name');
    }
    if(!rating){
      res
        .status(400)
        .send('Need rating');
    }
    const id = uuid();

    const newBookmark = {
      id, 
      name,
      rating
    };

    bookmarks.push(newBookmark);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({id});

  });

bookmarkRouter
  .route('/:id')
  .get((req, res) =>{
    const { id } = req.params;

    if(!id){
      res
        .status(404)
        .send('The id you sent does not exist');
    }
    const bookmark = bookmarks.find(bm => bm.id === id);
    res.status(200).send(bookmark);
  })
  .delete((req, res) => {
    
    const {id} = req.params;

    if(!id){
      res
        .status(404)
        .send('id not found');
    }
    const index = bookmarks.findIndex(bm => bm.id === id);
    bookmarks.splice(index, 1);

    res.status(204).end();


  });



module.exports = bookmarkRouter;