const express = require('express');
const helmet = require('helmet'); // npm i helmet
const morgan = require('morgan'); // npm i morgan

const server = express();
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');
server.use(express.json());
server.use(helmet());
server.use(morgan('tiny'));
server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

// mounting routers
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

//custom middleware

function logger(req, res, next) {
  const { method, originalUrl, timeStamp } = req;
  console.log(`${method} to ${originalUrl} at ${timeStamp}`);
  next();
}

module.exports = server;
