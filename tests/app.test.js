const request = require('supertest');
const app = require('../app'); // Assuming app.js exports the app

describe('GET /todos', function() {
  it('responds with JSON', function(done) {
    request(app)
      .get('/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('POST /todos', function() {
  it('creates a new todo and responds with JSON', function(done) {
    request(app)
      .post('/todos')
      .send({ title: 'Test Todo' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function(res) {
        if (!('title' in res.body)) throw new Error("Missing title in response");
      })
      .end(done);
  });
});
