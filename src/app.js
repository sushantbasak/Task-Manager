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

    if (!task) return res.status(404).send('Task not found');

    res.send(task);
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

app.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['desc', 'completed'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Update Operation' });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send('Something went Wrong');
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).send('Invalid Operation');
    }
    res.send(task);
  } catch (e) {
    res.status(500).send('Something Went Wrong');
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

app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['name', 'age', 'email', 'password'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Update operation' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send('Invalid Operation');
    }

    res.send(user);
  } catch (e) {
    res.status(500).send('Something went Wrong');
  }
});

app.listen(port, () =>
  console.log('Server started successfully on port ' + port)
);
