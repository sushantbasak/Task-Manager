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

app.get('/tasks', (req, res) => {
  Task.find({})
    .then((task) => res.send(task))
    .catch((e) => res.status(500).send('Internal Server Error'));
});

app.get('/tasks/:id', (req, res) => {
  Task.findById(req.params.id)
    .then((user) => {
      if (!user) res.status(404).send('User not found');
      res.send(user);
    })
    .catch((e) => res.status(500).send(e));
});

app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task
    .save()
    .then(() => res.status(201).send(task))
    .catch((e) => res.status(400).send(err));
});

app.get('/users', (req, res) => {
  User.find({})
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

app.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.send(user);
    })
    .catch((e) => res.status(400).send(e));
});

app.post('/users', (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.listen(port, () =>
  console.log('Server started successfully on port ' + port)
);
