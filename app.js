const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const promClient = require('prom-client');
const { updateActiveUsers } = require('./metrics/metrics');

// Create express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (Replace with your local MongoDB URI)
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a To-Do model
const Todo = mongoose.model('Todo', new mongoose.Schema({
  title: String,
  completed: Boolean
}));

// Prometheus metrics
promClient.collectDefaultMetrics();

// Define a counter metric for the number of to-do items
const todoCount = new promClient.Counter({
  name: 'todos_created',
  help: 'Total number of to-do items created',
});

// Define a custom metric for active users
const activeUsers = new promClient.Gauge({
  name: 'active_users_count',
  help: 'The number of active users currently using the app'
});

// Update active users count (for demonstration purposes, let's assume 5 active users)
updateActiveUsers(5);

// API routes

// GET /todos - Fetch all todos
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST /todos - Create a new todo
app.post('/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    completed: false
  });
  await todo.save();
  todoCount.inc();  // Increment the counter for each new to-do
  res.json(todo);
});

// PUT /todos/:id - Update an existing todo
app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});

// DELETE /todos/:id - Delete a todo
app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Expose metrics for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
