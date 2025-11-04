// Use the server package's mongoose instance so models and connection share the same mongoose
const path = require('path');
const mongoose = require(path.join(__dirname, '..', 'server', 'node_modules', 'mongoose'));
const cypress = require('cypress');

async function run() {
  // Connect to a local MongoDB as requested. Default to a dedicated test DB to avoid touching other DBs.
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/testing_e2e';
  console.log('Connecting to MongoDB at', uri);
  await mongoose.connect(uri);

  const app = require('../server/src/app');
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

  // Create a test user and write a JWT token to Cypress fixtures so E2E tests can authenticate
  const User = require('../server/src/models/User');
  const { generateToken } = require('../server/src/utils/auth');
  const fs = require('fs');
  const testUser = await User.create({ username: 'e2e-user', email: 'e2e@example.com', password: 'password' });
  const token = generateToken(testUser);
  const fixturesDir = path.join(__dirname, '..', 'cypress', 'fixtures');
  if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });
  fs.writeFileSync(path.join(fixturesDir, 'token.json'), JSON.stringify({ token }, null, 2));

  try {
    const results = await cypress.run({
      config: { baseUrl: `http://localhost:${port}` },
      spec: 'cypress/e2e/posts_api_e2e.cy.js',
      headed: false,
      record: false
    });

    console.log('Cypress results:', results.message || results);
    const failures = results.totalFailed || (results.failures && results.failures.length) || 0;
    await mongoose.disconnect();
    server.close();
    process.exit(failures ? 1 : 0);
  } catch (err) {
    console.error('Cypress run failed', err);
    await mongoose.disconnect();
    server.close(() => process.exit(1));
  }
}

run().catch(err => {
  console.error('Orchestrator failed', err);
  process.exit(1);
});
