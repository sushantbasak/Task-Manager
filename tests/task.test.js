const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
  userOne,
  userOneId,
  setupDatabase,
  userTwo,
  taskOne,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      desc: 'Test files detected',
    })
    .expect(201);

  const task = await Task.findById(response.body._id);

  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test('Should be able to get all task', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body.length).toBe(2);
});

test('Should not be able to delete first task by second user', async () => {
  request(app)
    .delete('/tasks/' + taskOne._id)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
