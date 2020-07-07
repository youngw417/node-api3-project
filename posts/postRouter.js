const express = require('express');
const PostDb = require('./postDb');
const router = express.Router();

router.get('/', (req, res) => {
  // get all posts
  PostDb.get()
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'Unable to retrieve a post from server.'
      });
    });
});

router.get('/:id', validatePostId, (req, res) => {
  // get a post with specific id
  const id = req.params.id;
  PostDb.getById(id)
    .then(post => res.status(200).json(post))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: `failed to find a post from the server`
      });
    });
});

router.delete('/:id', validatePostId, (req, res) => {
  // delete a post
  const id = req.params.id;

  PostDb.remove(id)
    .then(() => {
      console.log('this id', id);
      res.status(204).end();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'failed to remove from the post data'
      });
    });
});
router.put('/:id', validatePostId, (req, res) => {
  // update a post
  const id = parseInt(req.params.id);
  PostDb.update(id, req.body)
    .then(() => res.status(200).json(req.body))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'update failed by the server'
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const id = parseInt(req.params.id);
  if (typeof id === 'number') {
    PostDb.getById(id)
      .then(post => {
        if (post) next();
        else
          res.status(400).json({
            message: `Invalid post ID`
          });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.status(400).json({
      error: 'Unable to process.'
    });
  }
}

module.exports = router;
