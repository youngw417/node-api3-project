const express = require('express');
const UserDb = require('./userDb');
const PostDb = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // create a user
  // if (req.body) {
  UserDb.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'Adding an user in the database has failed.'
      });
    });
  // } else {
  //   res.status(400).json({
  //     errorMessage: 'User name is required.'
  //   });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // create a post with a user id
  const id = req.params.id;

  if (req.body.user_id) {
    if (id === req.body.user_id.toString()) {
      PostDb.insert(req.body)
        .then(post => res.status(201).json(post))
        .catch(err => {
          console.log(err);
          res.status(500).json({
            errorMessage: 'Adding a post in the database has failed.'
          });
        });
    } else {
      res.status(400).json({ error: 'The user_id does not match' });
    }
  } else {
    res.status(400).json({ error: 'user_id are required' });
  }
});

router.get('/', (req, res) => {
  // get all users
  UserDb.get()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'Unable to retrieve users data from server.'
      });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // get a user with a specific id
  const id = req.params.id;
  UserDb.getById(id).then(user => {
    // if (user)
    res.status(200).json(user);
    // else
    //   res.status(404).json({
    //     error: `failed to locate a user by ${id}`
    //   });
  });
  // .catch(err => {
  //   console.log(err);
  //   res.status(500).json({
  //     errorMessage: `failed to find the user from the server`
  //   });
  // });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // get all post for a user
  const id = parseInt(req.params.id);
  PostDb.get()
    .then(posts => {
      if (posts.length > 0) {
        const myPosts = posts.filter(el => el.user_id === id);
        res.status(200).json(myPosts);
      } else {
        res.status(404).json({
          error: 'No post are found for this user'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'Unable to retrieve posts from the server.'
      });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // delete a user
  const id = req.params.id;

  UserDb.remove(id)
    .then(count => {
      if (count === 1) res.status(204).end();
      else
        res.status(404).json({
          error: `No user found in this id #${id}`
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'failed to remove from the user data'
      });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  // update a user
  const id = parseInt(req.params.id);
  UserDb.update(id, req.body)
    .then(count => {
      if (count === 1) res.status(200).json(req.body);
      else
        res.status(400).json({
          error: 'update has failed. plase check id again'
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage: 'update failed by the server'
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const id = parseInt(req.params.id);
  if (typeof id === 'number') {
    UserDb.getById(id)
      .then(user => {
        if (user) next();
        else
          res.status(400).json({
            message: `Invalid user ID`
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

function validateUser(req, res, next) {
  // do your magic!
  console.log('body', req.body);
  if (Object.entries(req.body).length === 0) {
    res.status(400).json({ message: 'missing user data' });
  } else if (!req.body.name)
    res.status(400).json({ message: 'missing required name field' });
  else next();
}

function validatePost(req, res, next) {
  // do your magic!
  if (Object.entries(req.body).length === 0) {
    res.status(400).json({ message: 'missing post data' });
  } else if (!req.body.text)
    res.status(400).json({ message: 'missing required text field' });
  else next();
}

module.exports = router;
