const request = require('supertest');
const app = require('../app');

describe('To-Do API', () => {
  it('GET /todos should return all to-dos', (done) => {
    request(app)
      .get('/todos')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('POST /todos should create a new to-do', (done) => {
    request(app)
      .post('/todos')
      .send({ title: 'Test To-Do' })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect((res) => {
        if (!res.body.title) throw new Error('Missing title in response');
      })
      .end(done);
  });
});
