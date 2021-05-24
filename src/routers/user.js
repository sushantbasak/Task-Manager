const express = require('express');
const router = express.Router();
const auth = require('../middileware/auth');
const User = require('../models/user');

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

// router.get('/users/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).send('User not found');

//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (e) {
    res.status(400).send('Unable to login');
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send('Successfully Logout');
  } catch (e) {
    res.status(500).send('Invalid Operation');
  }
});

router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send('Successfully logout of all accounts');
  } catch (e) {
    res.status(500).send('Invalid Operation');
  }
});

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['name', 'age', 'email', 'password'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Update operation' });
  }

  try {
    const user = await User.findById(req.params.id);

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    // This code will not pass middleware when updated from the schema side hence need to be changed

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(404).send('Invalid Operation');
    // }
    await req.user.remove();

    res.send(req.user);
  } catch (e) {
    res.status(500).send('Something went Wrong');
  }
});

module.exports = router;
