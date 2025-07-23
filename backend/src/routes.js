const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { users, todos } = require('./db');

const router = express.Router();
const SECRET_KEY = 'your-secret-key';

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Middleware to verify JWT
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Todo routes
router.get('/todos', authenticate, (req, res) => {
  res.json(todos.filter(todo => todo.userId === req.userId));
});

router.post('/todos', authenticate, (req, res) => {
    console.log('Login request body:', req.body)
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  
  const newTodo = {
    id: todos.length + 1,
    userId: req.userId,
    title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.put('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todoIndex = todos.findIndex(t => t.id === parseInt(id) && t.userId === req.userId);
  
  if (todoIndex === -1) return res.status(404).json({ message: 'Todo not found' });
  
  if (title) todos[todoIndex].title = title;
  if (completed !== undefined) todos[todoIndex].completed = completed;
  
  res.json(todos[todoIndex]);
});

router.delete('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(t => t.id === parseInt(id) && t.userId === req.userId);
  
  if (todoIndex === -1) return res.status(404).json({ message: 'Todo not found' });
  
  todos.splice(todoIndex, 1);
  res.sendStatus(204);
});

module.exports = router;