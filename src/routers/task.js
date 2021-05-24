const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middileware/auth');

router.get('/tasks', auth, async (req, res) => {
  try {
    const task = await Task.find({ owner: req.user._id });
    res.send(task);
  } catch (e) {
    res.status(500).send('Internal Server Error');
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // const task = await Task.findById(req.params.id);

    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.status(404).send('Task not found');

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/tasks', auth, async (req, res) => {
  try {
    // const task = new Task(req.body);

    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });

    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['desc', 'completed'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Update Operation' });
  }

  try {
    // const task = await Task.findById(req.params.id);

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send('Task not found');
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    res.status(201).send(task);
  } catch (e) {
    res.status(400).send('Something went Wrong');
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send('Invalid Operation');
    }
    res.send(task);
  } catch (e) {
    res.status(500).send('Something Went Wrong');
  }
});

module.exports = router;
