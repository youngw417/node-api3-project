// code away!
const server = require('./server');

const port = 8002;

server.listen(port, () =>
  console.log(`\n**** The Server is running on port ${port} ***\n`)
);
