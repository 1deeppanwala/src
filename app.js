const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const promClient = require('prom-client');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a To-Do model
const Todo = mongoose.model('Todo', new mongoose.Schema({
  title: String,
  completed: Boolean
}));

// Prometheus metrics
promClient.collectDefaultMetrics();

const todoCount = new promClient.Counter({
  name: 'todos_created',
  help: 'Number of To-Do items created'
});

// API routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({ title: req.body.title, completed: false });
  await todo.save();
  todoCount.inc();
  res.json(todo);
});

app.put('/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
