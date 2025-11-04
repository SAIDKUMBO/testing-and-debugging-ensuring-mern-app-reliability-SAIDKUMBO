const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

async function start() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log('In-memory MongoDB started at', uri);
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const app = require('../src/app');
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  // graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await mongoose.disconnect();
    await mongod.stop();
    server.close(() => process.exit(0));
  });
}

start().catch(err => {
  console.error('Failed to start server with in-memory MongoDB', err);
  process.exit(1);
});
