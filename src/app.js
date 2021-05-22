const express = require('express');
require('./db/mongoose');

const app = express();

const port = process.env.PORT || 3000;

const User = require('./models/user');
const Task = require('./models/task');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.get('/tasks', async (req, res) => {
  try {
    const task = await Task.find({});
    res.send(task);
  } catch (e) {
    res.status(500).send('Internal Server Error');
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(404).send('Task not found');
  } catch (e) {
    res.status(500).send(e);
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users', async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () =>
  console.log('Server started successfully on port ' + port)
);
