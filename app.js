// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// API routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    completed: false
  });
  await todo.save();
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

