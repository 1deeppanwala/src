const request = require('supertest');
const http = require('http');
const sinon = require('sinon');
const app = require('../app');  // Import the app

describe('To-Do API (without MongoDB)', function () {
  let server;
  let findStub;
  let saveStub;
  let removeStub;

  // Set a larger timeout for all tests (20 seconds)
  this.timeout(20000); // 20 seconds timeout for each test

  before(async () => {
    console.log("Starting before hook...");
    // Stubbing the mongoose methods to simulate MongoDB operations
    findStub = sinon.stub().resolves([{ title: 'Test Todo', completed: false }]);
    saveStub = sinon.stub().resolves({ title: 'Test To-Do', completed: false });
    removeStub = sinon.stub().resolves();

    // Wrap the app in an HTTP server
    server = http.createServer(app);

    // Mocking the app's Todo routes to use the stubs
    app.locals.Todo = { find: findStub, save: saveStub, findByIdAndDelete: removeStub };

    // Start the server
    await new Promise((resolve) => server.listen(resolve));
    console.log("Server started.");
  });

  after(async () => {
    console.log("Starting after hook...");
    // Close the server after tests
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("Server closed.");
    }
  });

  it('GET /todos should return all to-dos', async () => {
    console.log("Starting GET /todos test...");
    const res = await request(server)
      .get('/todos')
      .expect('Content-Type', /json/)
      .expect(200);
    console.log("GET /todos successful:", res.body);
  });

  it('POST /todos should create a new to-do', async () => {
    console.log("Starting POST /todos test...");
    const res = await request(server)
      .post('/todos')
      .send({ title: 'Test To-Do' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    console.log("POST /todos successful:", res.body);
  });
});
