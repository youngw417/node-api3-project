// code away!
const server = require('./server');

const PORT = process.env.PORT || 8002;

server.listen(PORT, () =>
  console.log(`\n**** The Server is running on port ${PORT} ***\n`)
);
