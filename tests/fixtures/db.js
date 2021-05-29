const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: 'Kevin',
  email: 'kevin@gmail.com',
  password: 'fsfs@@FFF',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  name: 'Zlee',
  email: 'zlee@gmail.com',
  password: 'fsfsd@@FFF',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'First Task',
  completed: 'false',
  owner: userOneId,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'Second Task',
  completed: 'true',
  owner: userOneId,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  desc: 'Third Task',
  completed: 'true',
  owner: userTwoId,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(userTwo).save();
  await new User(userOne).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  setupDatabase,
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
};
