const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get('/tasks', async (req, res) => {
  try {
    const task = await Task.find({});
    res.send(task);
  } catch (e) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).send('Task not found');

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['desc', 'completed'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Update Operation' });
  }

  try {
    const task = await Task.findById(req.params.id);

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    if (!task) {
      return res.status(404).send('Task not found');
    }

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send('Something went Wrong');
  }
});

router.delete('/tasks/:id', async (req, res) => {
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

module.exports = router;
