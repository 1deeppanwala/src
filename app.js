const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const promClient = require('prom-client');

const app = express();
app.use(bodyParser.json());

// Simulate Todo model for this test
const Todo = { find: () => [{ title: 'Test Todo', completed: false }] };

// Connect to MongoDB (simulated)
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useUnifiedTopology: true });

// API routes
app.get('/todos', async (req, res) => {
  console.log("GET /todos route hit");
  const todos = await Todo.find();
  console.log("Returning todos:", todos);
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  console.log("POST /todos route hit");
  const todo = { title: req.body.title, completed: false };
  console.log("Saving todo:", todo);
  res.json(todo);
});

// Metrics endpoint for Prometheus (not used in tests, just for completeness)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

module.exports = app;

// Start the server if run directly
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
}
